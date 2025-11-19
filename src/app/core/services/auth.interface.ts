// ============================================
// AUTH SERVICE INTERFACE
// ============================================
// Esta interfaz abstrae el sistema de autenticación específico
// Permite cambiar de proveedor sin modificar los componentes

import { Observable } from 'rxjs';
import { Profile, UserRole } from '../models';

export interface AuthUser {
  id: string;
  email: string;
  role?: UserRole;
  profile?: Profile;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  boxId?: string; // Required for athletes
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface IAuthService {
  // Authentication
  signUp(credentials: SignUpCredentials): Observable<AuthUser>;
  signIn(credentials: SignInCredentials): Observable<AuthUser>;
  signOut(): Observable<void>;
  
  // Session
  getCurrentUser(): Observable<AuthUser | null>;
  getSession(): Observable<any | null>;
  
  // Password management
  resetPassword(email: string): Observable<void>;
  updatePassword(newPassword: string): Observable<void>;
}

