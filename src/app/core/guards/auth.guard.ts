import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthStateService } from '@core/services/auth-state.service';
import { map, take, filter, switchMap, first } from 'rxjs';

/**
 * Auth Guard
 * 
 * Protege rutas que requieren autenticación.
 * Si el usuario no está autenticado, redirige al login.
 * 
 * @example
 * ```typescript
 * {
 *   path: 'dashboard',
 *   component: DashboardComponent,
 *   canActivate: [authGuard]
 * }
 * ```
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  // Esperar a que la inicialización termine, luego verificar autenticación
  return authState.isLoaded$.pipe(
    first(loaded => loaded === true), // Esperar hasta que esté cargado (o tomar el primero si ya es true)
    switchMap(() => authState.currentUser$.pipe(take(1))),
    map(user => {
      if (user) {
        console.log('✅ Auth Guard: Usuario autenticado', user.email);
        return true;
      }

      console.warn('🔒 Access denied. Redirecting to login...');
      return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
    })
  );
};

/**
 * Business Owner Guard
 * 
 * Protege rutas que solo pueden acceder business owners.
 * 
 * @example
 * ```typescript
 * {
 *   path: 'manage-classes',
 *   component: ManageClassesComponent,
 *   canActivate: [businessOwnerGuard]
 * }
 * ```
 */
export const businessOwnerGuard: CanActivateFn = (route, state) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  // Primero verificar autenticación
  if (!authState.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  // Verificar rol
  if (authState.isBusinessOwner()) {
    return true;
  }

  // Si no es business owner, redirigir al dashboard
  console.warn('🔒 Access denied. User is not a business owner.');
  return router.createUrlTree(['/dashboard']);
};

/**
 * Athlete Guard
 * 
 * Protege rutas que solo pueden acceder athletes.
 */
export const athleteGuard: CanActivateFn = (route, state) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  // Primero verificar autenticación
  if (!authState.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  // Verificar rol
  if (authState.isAthlete()) {
    return true;
  }

  // Si no es athlete, redirigir al dashboard
  console.warn('🔒 Access denied. User is not an athlete.');
  return router.createUrlTree(['/dashboard']);
};

