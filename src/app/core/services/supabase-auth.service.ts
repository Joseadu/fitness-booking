// ============================================
// SUPABASE AUTH SERVICE IMPLEMENTATION
// ============================================

import { Injectable } from '@angular/core';
import { Observable, from, map, switchMap, of, throwError } from 'rxjs';
import { IAuthService, AuthUser, SignUpCredentials, SignInCredentials } from './auth.interface';
import { getSupabaseClient } from './supabase.client';
import { UserRole } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SupabaseAuthService implements IAuthService {
  private supabase = getSupabaseClient();

  signUp(credentials: SignUpCredentials): Observable<AuthUser> {
    return from(
      this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => error);
        }
        
        if (!data.user) {
          return throwError(() => new Error('User creation failed'));
        }

        // Create profile
        return from(
          this.supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              full_name: credentials.fullName,
              role: credentials.role,
              box_id: credentials.boxId,
            })
            .select()
            .single()
        ).pipe(
          map(({ data: profile, error: profileError }) => {
            if (profileError) {
              throw profileError;
            }
            
            return {
              id: data.user!.id,
              email: data.user!.email!,
              role: credentials.role,
              profile: profile
            };
          })
        );
      })
    );
  }

  signIn(credentials: SignInCredentials): Observable<AuthUser> {
    return from(
      this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
    ).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          return throwError(() => error);
        }
        
        if (!data.user) {
          return throwError(() => new Error('Sign in failed'));
        }

        // Fetch profile
        return from(
          this.supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()
        ).pipe(
          map(({ data: profile, error: profileError }) => {
            if (profileError) {
              throw profileError;
            }
            
            return {
              id: data.user!.id,
              email: data.user!.email!,
              role: profile?.role as UserRole,
              profile: profile
            };
          })
        );
      })
    );
  }

  signOut(): Observable<void> {
    return from(this.supabase.auth.signOut()).pipe(
      map(() => undefined)
    );
  }

  getCurrentUser(): Observable<AuthUser | null> {
    return from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data, error }) => {
        if (error || !data.user) {
          return of(null);
        }

        // Fetch profile
        return from(
          this.supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()
        ).pipe(
          map(({ data: profile }) => {
            if (!profile) {
              return null;
            }
            
            return {
              id: data.user!.id,
              email: data.user!.email!,
              role: profile.role as UserRole,
              profile: profile
            };
          })
        );
      })
    );
  }

  getSession(): Observable<any | null> {
    return from(this.supabase.auth.getSession()).pipe(
      map(({ data }) => data.session)
    );
  }

  resetPassword(email: string): Observable<void> {
    return from(
      this.supabase.auth.resetPasswordForEmail(email)
    ).pipe(
      map(() => undefined)
    );
  }

  updatePassword(newPassword: string): Observable<void> {
    return from(
      this.supabase.auth.updateUser({ password: newPassword })
    ).pipe(
      map(() => undefined)
    );
  }
}

