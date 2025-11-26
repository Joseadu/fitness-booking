import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '@shared/components';

@Component({
  selector: 'fb-design-system',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './design-system.page.html',
  styleUrl: './design-system.page.scss'
})
export class DesignSystemPage {
  items = [1, 2, 3, 4, 5, 6];
}

