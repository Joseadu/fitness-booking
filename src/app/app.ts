import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * App Component
 * 
 * Componente raíz de la aplicación.
 * Contiene el router-outlet para las diferentes rutas.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: []
})
export class App {}
