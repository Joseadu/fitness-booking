import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button, Input, FormField } from '@shared/components';
import { AuthStateService } from '@core/services';

/**
 * Login Page
 * 
 * Página de inicio de sesión.
 * Permite a usuarios registrados acceder a la aplicación.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Button, Input, FormField],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private authState = inject(AuthStateService);
  private router = inject(Router);

  /**
   * Formulario de login
   */
  protected form: FormGroup;

  /**
   * Estados
   */
  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Obtener mensaje de error del campo
   */
  protected getFieldError(fieldName: string): string | null {
    const control = this.form.get(fieldName);
    
    if (!control || !control.errors || !control.touched) {
      return null;
    }

    if (control.errors['required']) {
      return 'Este campo es requerido';
    }

    if (control.errors['email']) {
      return 'Email inválido';
    }

    if (control.errors['minlength']) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }

    return null;
  }

  /**
   * Submit del formulario
   */
  protected async onSubmit(): Promise<void> {
    // Marcar todos los campos como touched para mostrar errores
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });

    if (this.form.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.value;

    this.authState.signIn(email, password).subscribe({
      next: (user) => {
        console.log('✅ Login exitoso:', user);
        this.isLoading.set(false);
        
        // Redirigir al dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('❌ Error en login:', error);
        this.isLoading.set(false);
        
        // Mapear errores de Supabase a mensajes user-friendly
        if (error.message?.includes('Invalid login credentials')) {
          this.errorMessage.set('Email o contraseña incorrectos');
        } else if (error.message?.includes('Email not confirmed')) {
          this.errorMessage.set('Por favor, confirma tu email antes de iniciar sesión');
        } else {
          this.errorMessage.set('Error al iniciar sesión. Intenta nuevamente.');
        }
      }
    });
  }
}

