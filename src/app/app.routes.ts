import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta raíz - redirige al login
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },

  // Auth Layout (sin header/sidebar)
  {
    path: 'auth',
    loadComponent: () => import('./layout/auth-layout/auth-layout').then(m => m.AuthLayout),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.page').then(m => m.LoginPage)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.page').then(m => m.RegisterPage)
      },
      {
        path: 'email-confirmation',
        loadComponent: () => import('./features/auth/email-confirmation/email-confirmation.page').then(m => m.EmailConfirmationPage)
      }
    ]
  },

  // Main Layout (con header) - Rutas protegidas
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'onboarding',
        loadComponent: () => import('./features/onboarding/onboarding.page').then(m => m.OnboardingPage)
      }
      // Aquí se agregarán más rutas protegidas (classes, bookings, etc.)
    ]
  },

  // Design System (público, sin layout)
  {
    path: 'design-system',
    loadComponent: () => import('./features/design-system/design-system.page').then(m => m.DesignSystemPage)
  },

  // 404 - Not found
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
