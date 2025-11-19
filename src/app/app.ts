import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from './shared/components';
import { getSupabaseClient } from './core/services/supabase.client';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Button],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  ngOnInit() {
    this.testSupabaseConnection();
  }

  private async testSupabaseConnection() {
    try {
      const supabase = getSupabaseClient();
      
      console.log('🔗 Probando conexión a Supabase...');
      
      // Test 1: Verificar que el cliente se creó
      console.log('✅ Cliente de Supabase creado correctamente');
      
      // Test 2: Intentar obtener la sesión
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn('⚠️ Error al obtener sesión (normal si no hay usuario logueado):', sessionError.message);
      } else {
        console.log('✅ Sesión obtenida (null es normal si no hay usuario):', session);
      }
      
      // Test 3: Verificar conexión a la base de datos (listar tablas accesibles)
      const { data: tables, error: tablesError } = await supabase
        .from('profiles')
        .select('count')
        .limit(0);
      
      if (tablesError) {
        console.warn('⚠️ Error al conectar con la tabla profiles:', tablesError.message);
      } else {
        console.log('✅ Conexión a base de datos exitosa');
      }
      
      console.log('🎉 ¡Supabase está configurado correctamente!');
      
    } catch (error) {
      console.error('❌ Error al conectar con Supabase:', error);
    }
  }
}
