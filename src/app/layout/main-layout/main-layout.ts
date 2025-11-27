import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '@shared/components';

/**
 * Main Layout Component
 * 
 * Layout principal para usuarios autenticados.
 * Incluye header y sidebar (si es necesario).
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {}

