import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button, Input, FormField } from '@shared/components';
import { AuthStateService } from '@core/services';
import { UserRole } from '@core/models';

/**
 * Register Page
 * 
 * Página de registro de usuarios.
 * Permite crear cuenta como Business Owner o Athlete.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Button, Input, FormField],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss'
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authState = inject(AuthStateService);
  private router = inject(Router);

  /**
   * Formulario de registro
   */
  protected form: FormGroup;

  /**
   * Estados
   */
  protected isLoading = signal(false);
  protected errorMessage = signal<string | null>(null);
  protected selectedRole = signal<UserRole>(UserRole.ATHLETE);

  /**
   * Roles disponibles
   */
  protected readonly UserRole = UserRole;

  constructor() {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phone: [''],
      role: [UserRole.ATHLETE, [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });

    // Sync role con signal
    this.form.get('role')?.valueChanges.subscribe(role => {
      this.selectedRole.set(role);
    });
  }

  /**
   * Validador custom: contraseñas deben coincidir
   */
  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
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

    if (fieldName === 'confirmPassword' && this.form.errors?.['passwordMismatch']) {
      return 'Las contraseñas no coinciden';
    }

    return null;
  }

  /**
   * Seleccionar rol
   */
  protected selectRole(role: UserRole): void {
    this.form.patchValue({ role });
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

    const { fullName, email, password, phone, role } = this.form.value;

    // 1. Crear usuario en Supabase Auth
    this.authState.signUp(email, password, fullName, role).subscribe({
      next: (user) => {
        console.log('✅ Usuario y perfil creados:', user);
        this.isLoading.set(false);
        
        // Redirigir a página de confirmación de email
        this.router.navigate(['/auth/email-confirmation'], {
          queryParams: { email }
        });
      },
      error: (error) => {
        console.error('❌ Error en registro:', error);
        this.isLoading.set(false);
        
        // Mapear errores de Supabase a mensajes user-friendly
        if (error.message?.includes('already registered')) {
          this.errorMessage.set('Este email ya está registrado');
        } else if (error.message?.includes('Password should be')) {
          this.errorMessage.set('La contraseña no cumple los requisitos mínimos');
        } else {
          this.errorMessage.set('Error al crear la cuenta. Intenta nuevamente.');
        }
      }
    });
  }
}

