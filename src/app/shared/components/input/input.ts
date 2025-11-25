import { Component, Input as InputDecorator, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Input Component
 * 
 * Componente de input reutilizable compatible con Angular Forms (Reactive y Template-driven).
 * Soporta diferentes tipos, estados de error, disabled, y más.
 * 
 * @example
 * ```html
 * <fb-input 
 *   type="email" 
 *   placeholder="correo@ejemplo.com"
 *   [error]="emailError"
 *   [(ngModel)]="email">
 * </fb-input>
 * ```
 */
@Component({
  selector: 'fb-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true
    }
  ]
})
export class Input implements ControlValueAccessor {
  /**
   * Tipo de input
   */
  @InputDecorator() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';
  
  /**
   * Placeholder del input
   */
  @InputDecorator() placeholder = '';
  
  /**
   * Mensaje de error a mostrar
   */
  @InputDecorator() error: string | null = null;
  
  /**
   * Si el input está deshabilitado
   */
  @InputDecorator() disabled = false;
  
  /**
   * ID del input (para label)
   */
  @InputDecorator() inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  
  /**
   * Nombre del input
   */
  @InputDecorator() name = '';
  
  /**
   * Autocomplete del input
   */
  @InputDecorator() autocomplete: string | null = null;
  
  /**
   * Si es requerido
   */
  @InputDecorator() required = false;
  
  /**
   * Tamaño del input
   */
  @InputDecorator() size: 'sm' | 'md' | 'lg' = 'md';
  
  /**
   * Icono al inicio (opcional)
   */
  @InputDecorator() iconStart: string | null = null;
  
  /**
   * Icono al final (opcional)
   */
  @InputDecorator() iconEnd: string | null = null;

  /**
   * Valor del input
   */
  protected value = signal<string>('');
  
  /**
   * Si está enfocado
   */
  protected focused = signal(false);
  
  /**
   * Si el password está visible
   */
  protected showPassword = signal(false);

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  /**
   * Obtener clases CSS del input
   */
  protected get inputClasses(): string {
    const classes = ['input'];
    
    // Tamaño
    classes.push(`input--${this.size}`);
    
    // Estado
    if (this.error) classes.push('input--error');
    if (this.disabled) classes.push('input--disabled');
    if (this.focused()) classes.push('input--focused');
    if (this.iconStart) classes.push('input--with-icon-start');
    if (this.iconEnd || this.type === 'password') classes.push('input--with-icon-end');
    
    return classes.join(' ');
  }
  
  /**
   * Obtener el tipo de input actual (puede cambiar si es password)
   */
  protected get currentType(): string {
    if (this.type === 'password' && this.showPassword()) {
      return 'text';
    }
    return this.type;
  }

  /**
   * Manejar cambio de valor
   */
  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  /**
   * Manejar focus
   */
  protected onFocus(): void {
    this.focused.set(true);
  }

  /**
   * Manejar blur
   */
  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }
  
  /**
   * Toggle password visibility
   */
  protected togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

