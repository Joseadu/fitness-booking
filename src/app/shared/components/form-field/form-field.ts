import { Component, Input as InputDecorator } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * FormField Component
 * 
 * Wrapper para inputs de formulario que incluye label, mensaje de ayuda y proyección de contenido.
 * 
 * @example
 * ```html
 * <fb-form-field label="Email" [required]="true">
 *   <fb-input type="email" formControlName="email"></fb-input>
 * </fb-form-field>
 * ```
 */
@Component({
  selector: 'fb-form-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss'
})
export class FormField {
  /**
   * Label del campo
   */
  @InputDecorator() label = '';
  
  /**
   * ID del input asociado (para el label)
   */
  @InputDecorator() inputId = '';
  
  /**
   * Si el campo es requerido (muestra asterisco)
   */
  @InputDecorator() required = false;
  
  /**
   * Mensaje de ayuda/descripción
   */
  @InputDecorator() hint: string | null = null;
  
  /**
   * Si se debe mostrar en columna (label arriba del input)
   */
  @InputDecorator() column = true;
}

