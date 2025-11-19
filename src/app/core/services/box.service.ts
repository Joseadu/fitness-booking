// ============================================
// BOX SERVICE - Domain Service
// ============================================

import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Box, CreateBoxDto, UpdateBoxDto } from '../models';
import { SupabaseDatabaseService } from './supabase-database.service';

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  private db = inject(SupabaseDatabaseService);

  /**
   * Obtener box por owner ID
   */
  getMyBox(ownerId: string): Observable<Box | null> {
    return this.db.query<Box>('boxes', {
      filter: { owner_id: ownerId },
      limit: 1
    }).pipe(
      map((boxes) => boxes.length > 0 ? boxes[0] : null)
    );
  }

  /**
   * Obtener box por ID
   */
  getBoxById(id: string): Observable<Box | null> {
    return this.db.getById<Box>('boxes', id);
  }

  /**
   * Crear box
   */
  createBox(ownerId: string, boxData: CreateBoxDto): Observable<Box> {
    return this.db.insert<Box>('boxes', {
      ...boxData,
      owner_id: ownerId
    });
  }

  /**
   * Actualizar box
   */
  updateBox(id: string, boxData: UpdateBoxDto): Observable<Box> {
    return this.db.update<Box>('boxes', id, boxData);
  }

  /**
   * Desactivar box
   */
  deactivateBox(id: string): Observable<Box> {
    return this.db.update<Box>('boxes', id, { is_active: false });
  }

  /**
   * Eliminar box
   */
  deleteBox(id: string): Observable<void> {
    return this.db.delete('boxes', id);
  }
}

