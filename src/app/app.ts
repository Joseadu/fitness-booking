import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from './shared/components';
import { ClassService, BoxService } from './core/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Button],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private classService = inject(ClassService);
  private boxService = inject(BoxService);

  testClasses = signal<any[]>([]);
  testBox = signal<any>(null);

  ngOnInit() {
    this.testServices();
  }

  private testServices() {
    console.log('🧪 Probando servicios con datos reales...\n');
    
    // Test 1: Obtener clases
    console.log('📅 Test 1: Obteniendo clases de hoy...');
    const today = new Date().toISOString().split('T')[0];
    this.classService.getClassesByDate(today).subscribe({
      next: (classes) => {
        console.log('✅ Clases obtenidas:', classes.length);
        console.table(classes);
        this.testClasses.set(classes);
      },
      error: (error) => {
        console.error('❌ Error al obtener clases:', error);
      }
    });

    // Test 2: Obtener box
    console.log('\n🏢 Test 2: Obteniendo box...');
    this.boxService.getBoxById('f47ac10b-58cc-4372-a567-0e02b2c3d479').subscribe({
      next: (box) => {
        console.log('✅ Box obtenido:', box);
        this.testBox.set(box);
      },
      error: (error) => {
        console.error('❌ Error al obtener box:', error);
      }
    });

    console.log('\n💡 Tip: Mira la consola para ver los resultados');
  }
}
