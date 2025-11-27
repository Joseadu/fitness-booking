import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta raíz - redirige al login
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },

  // Auth routes (Login, Register, etc.)
  {
    path: 'auth',
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

  // Dashboard (protegido)
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [authGuard]
  },

  // Onboarding para business owners
  {
    path: 'onboarding',
    loadComponent: () => import('./features/onboarding/onboarding.page').then(m => m.OnboardingPage),
    canActivate: [authGuard]
  },

  // Design System (público)
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
