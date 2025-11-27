import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStateService } from '@core/services';
import { Button } from '../button/button';

/**
 * Header Component
 * 
 * Header principal de la aplicación con:
 * - Logo/Brand
 * - Navegación principal
 * - Menú de usuario (dropdown)
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, Button],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  private authState = inject(AuthStateService);
  private router = inject(Router);

  // Estado del menú dropdown
  protected isUserMenuOpen = signal(false);

  // Usuario actual
  protected currentUser$ = this.authState.currentUser$;
  protected currentProfile$ = this.authState.currentProfile$;

  /**
   * Cerrar sesión
   */
  protected async signOut(): Promise<void> {
    try {
      await this.authState.signOut();
      // La navegación ya se hace en el servicio, pero por si acaso:
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  /**
   * Toggle del menú de usuario
   */
  protected toggleUserMenu(): void {
    this.isUserMenuOpen.update(value => !value);
  }

  /**
   * Cerrar el menú de usuario
   */
  protected closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }
}
