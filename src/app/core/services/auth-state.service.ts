import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from, map, tap } from 'rxjs';
import { SupabaseAuthService } from './supabase-auth.service';
import { Profile, UserRole } from '@core/models';
import { getSupabaseClient } from './supabase.client';

/**
 * User interface (simplified from Supabase User)
 */
export interface User {
  id: string;
  email: string;
  created_at: string;
}

/**
 * AuthState Service
 * 
 * Servicio para gestionar el estado de autenticación de la aplicación.
 * Proporciona acceso al usuario actual, su perfil y métodos para login/logout.
 * 
 * Usa signals para reactividad y observables para operaciones async.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private authService = inject(SupabaseAuthService);
  private router = inject(Router);
  private supabase = getSupabaseClient();

  /**
   * Usuario actual (auth)
   */
  private _currentUser$ = new BehaviorSubject<User | null>(null);
  public currentUser$ = this._currentUser$.asObservable();

  /**
   * Perfil del usuario actual (con rol, nombre, etc.)
   */
  private _currentProfile$ = new BehaviorSubject<Profile | null>(null);
  public currentProfile$ = this._currentProfile$.asObservable();

  /**
   * Estado de carga
   */
  public isLoading = signal(true);

  /**
   * Si el usuario está autenticado (signal computed)
   */
  public isAuthenticated = computed(() => this._currentUser$.value !== null);

  /**
   * Rol del usuario actual (signal computed)
   */
  public userRole = computed(() => this._currentProfile$.value?.role || null);

  constructor() {
    this.initializeAuth();
  }

  /**
   * Inicializar autenticación
   * Recupera la sesión al cargar la app
   */
  private async initializeAuth(): Promise<void> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      
      if (session?.user) {
        await this.loadUserData(session.user);
      }
      
      // Escuchar cambios de autenticación
      this.supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔐 Auth state changed:', event);
        
        if (session?.user) {
          await this.loadUserData(session.user);
        } else {
          this.clearUserData();
        }
      });
      
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Cargar datos del usuario (user + profile)
   */
  private async loadUserData(authUser: any): Promise<void> {
    // Setear usuario de auth
    const user: User = {
      id: authUser.id,
      email: authUser.email!,
      created_at: authUser.created_at
    };
    this._currentUser$.next(user);

    // Obtener perfil de la base de datos
    try {
      const { data: profile, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;
      
      if (profile) {
        this._currentProfile$.next(profile as Profile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  /**
   * Limpiar datos del usuario
   */
  private clearUserData(): void {
    this._currentUser$.next(null);
    this._currentProfile$.next(null);
  }

  /**
   * Login
   */
  public signIn(email: string, password: string): Observable<User> {
    return this.authService.signIn({ email, password }).pipe(
      tap(async (user: any) => {
        await this.loadUserData(user);
      }),
      map((user: any) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }))
    );
  }

  /**
   * Register
   */
  public signUp(email: string, password: string, fullName: string, role: UserRole): Observable<User> {
    return this.authService.signUp({ email, password, fullName, role }).pipe(
      map((user: any) => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }))
    );
  }

  /**
   * Logout
   */
  public async signOut(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
      this.clearUserData();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Obtener usuario actual (snapshot)
   */
  public getCurrentUser(): User | null {
    return this._currentUser$.value;
  }

  /**
   * Obtener perfil actual (snapshot)
   */
  public getCurrentProfile(): Profile | null {
    return this._currentProfile$.value;
  }

  /**
   * Check if user has specific role
   */
  public hasRole(role: UserRole): boolean {
    return this.userRole() === role;
  }

  /**
   * Check if user is business owner
   */
  public isBusinessOwner(): boolean {
    return this.hasRole(UserRole.BUSINESS_OWNER);
  }

  /**
   * Check if user is athlete
   */
  public isAthlete(): boolean {
    return this.hasRole(UserRole.ATHLETE);
  }

  /**
   * Reenviar email de confirmación
   */
  public resendConfirmationEmail(email: string): Observable<void> {
    return this.authService.resendConfirmationEmail(email);
  }
}

