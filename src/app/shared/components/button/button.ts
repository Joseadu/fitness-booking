import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'fb-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  // Inputs usando el nuevo signal input API de Angular
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  disabled = input<boolean>(false);
  fullWidth = input<boolean>(false);
  loading = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');

  // Computed para las clases CSS
  buttonClasses = computed(() => {
    return [
      'fb-button',
      `fb-button--${this.variant()}`,
      `fb-button--${this.size()}`,
      this.fullWidth() ? 'fb-button--full-width' : '',
      this.loading() ? 'fb-button--loading' : '',
    ].filter(Boolean).join(' ');
  });
}
