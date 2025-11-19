// ============================================
// DATABASE SERVICE INTERFACE
// ============================================
// Esta interfaz abstrae el backend específico (Supabase)
// Permite cambiar de backend sin modificar los componentes

import { Observable } from 'rxjs';

export interface QueryOptions {
  filter?: Record<string, any>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
}

export interface IDatabaseService {
  // Generic CRUD operations
  query<T>(
    table: string,
    options?: QueryOptions
  ): Observable<T[]>;
  
  getById<T>(
    table: string,
    id: string
  ): Observable<T | null>;
  
  insert<T>(
    table: string,
    data: Partial<T>
  ): Observable<T>;
  
  update<T>(
    table: string,
    id: string,
    data: Partial<T>
  ): Observable<T>;
  
  delete(
    table: string,
    id: string
  ): Observable<void>;
  
  // Custom queries
  execute<T>(
    query: string,
    params?: any[]
  ): Observable<T[]>;
}

