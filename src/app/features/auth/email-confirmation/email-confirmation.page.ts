import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Button } from '@shared/components';
import { AuthStateService } from '@core/services';

/**
 * Email Confirmation Page
 * 
 * Página mostrada después del registro exitoso.
 * Informa al usuario que debe confirmar su email.
 */
@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, Button],
  templateUrl: './email-confirmation.page.html',
  styleUrl: './email-confirmation.page.scss'
})
export class EmailConfirmationPage implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authState = inject(AuthStateService);
  
  email = signal<string>('');
  isResending = signal<boolean>(false);
  resendSuccess = signal<boolean>(false);
  resendError = signal<string | null>(null);

  ngOnInit() {
    // Obtener email desde query params
    const emailParam = this.route.snapshot.queryParamMap.get('email');
    
    if (emailParam) {
      this.email.set(emailParam);
    } else {
      // Si no hay email, redirigir al login
      this.router.navigate(['/auth/login']);
    }
  }

  /**
   * Reenviar email de confirmación
   */
  protected async onResendEmail(): Promise<void> {
    const emailValue = this.email();
    if (!emailValue) return;

    this.isResending.set(true);
    this.resendSuccess.set(false);
    this.resendError.set(null);

    this.authState.resendConfirmationEmail(emailValue).subscribe({
      next: () => {
        this.isResending.set(false);
        this.resendSuccess.set(true);
        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          this.resendSuccess.set(false);
        }, 5000);
      },
      error: (error) => {
        this.isResending.set(false);
        this.resendError.set('Error al reenviar el email. Intenta nuevamente.');
        console.error('Error resending confirmation email:', error);
      }
    });
  }
}

