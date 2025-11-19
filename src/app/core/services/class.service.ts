// ============================================
// CLASS SERVICE - Domain Service
// ============================================
// Este servicio usa la abstracción IDatabaseService
// NO depende directamente de Supabase

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Class, CreateClassDto, UpdateClassDto, ClassWithDetails } from '../models';
import { SupabaseDatabaseService } from './supabase-database.service';
import { getSupabaseClient } from './supabase.client';
import { from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private db = inject(SupabaseDatabaseService);
  private supabase = getSupabaseClient(); // Solo para queries complejas

  /**
   * Obtener todas las clases de un box
   */
  getClassesByBox(boxId: string): Observable<Class[]> {
    return this.db.query<Class>('classes', {
      filter: { box_id: boxId },
      order: { column: 'date', ascending: true }
    });
  }

  /**
   * Obtener clases por fecha
   */
  getClassesByDate(date: string): Observable<Class[]> {
    return this.db.query<Class>('classes', {
      filter: { date },
      order: { column: 'start_time', ascending: true }
    });
  }

  /**
   * Obtener clases disponibles con detalles (includes)
   * Esta es una query más compleja que necesita joins
   */
  getAvailableClasses(boxId: string, fromDate: string): Observable<ClassWithDetails[]> {
    // Para queries complejas con joins, usamos directamente el cliente
    // pero SOLO en este servicio, no en los componentes
    return from(
      this.supabase
        .from('classes')
        .select(`
          *,
          wod_type:wod_types(*),
          bookings(count)
        `)
        .eq('box_id', boxId)
        .gte('date', fromDate)
        .eq('is_cancelled', false)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as ClassWithDetails[];
      })
    );
  }

  /**
   * Obtener clase por ID
   */
  getClassById(id: string): Observable<Class | null> {
    return this.db.getById<Class>('classes', id);
  }

  /**
   * Crear nueva clase
   */
  createClass(boxId: string, classData: CreateClassDto): Observable<Class> {
    return this.db.insert<Class>('classes', {
      ...classData,
      box_id: boxId
    });
  }

  /**
   * Actualizar clase
   */
  updateClass(id: string, classData: UpdateClassDto): Observable<Class> {
    return this.db.update<Class>('classes', id, classData);
  }

  /**
   * Cancelar clase
   */
  cancelClass(id: string, reason: string): Observable<Class> {
    return this.db.update<Class>('classes', id, {
      is_cancelled: true,
      cancellation_reason: reason
    });
  }

  /**
   * Eliminar clase
   */
  deleteClass(id: string): Observable<void> {
    return this.db.delete('classes', id);
  }

  /**
   * Verificar disponibilidad de una clase
   */
  checkAvailability(classId: string): Observable<boolean> {
    return from(
      this.supabase
        .rpc('check_class_availability', { class_id: classId })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as boolean;
      })
    );
  }
}

