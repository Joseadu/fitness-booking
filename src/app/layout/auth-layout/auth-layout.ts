import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Auth Layout Component
 * 
 * Layout minimalista para páginas de autenticación (login, register, etc.)
 * No incluye header ni sidebar.
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class AuthLayout {}

