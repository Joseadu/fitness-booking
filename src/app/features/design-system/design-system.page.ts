import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button, Input, FormField } from '@shared/components';

@Component({
  selector: 'fb-design-system',
  standalone: true,
  imports: [CommonModule, FormsModule, Button, Input, FormField],
  templateUrl: './design-system.page.html',
  styleUrl: './design-system.page.scss'
})
export class DesignSystemPage {
  items = [1, 2, 3, 4, 5, 6];
  
  // Para demostrar inputs
  textValue = '';
  emailValue = '';
  passwordValue = '';
  disabledValue = 'Campo deshabilitado';
}

