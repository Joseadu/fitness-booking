// ============================================
// SUPABASE DATABASE SERVICE IMPLEMENTATION
// ============================================

import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { IDatabaseService, QueryOptions } from './database.interface';
import { getSupabaseClient } from './supabase.client';

@Injectable({
  providedIn: 'root'
})
export class SupabaseDatabaseService implements IDatabaseService {
  private supabase = getSupabaseClient();

  query<T>(table: string, options?: QueryOptions): Observable<T[]> {
    let query = this.supabase.from(table).select('*');

    // Apply filters
    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    // Apply ordering
    if (options?.order) {
      query = query.order(options.order.column, { 
        ascending: options.order.ascending ?? true 
      });
    }

    // Apply pagination
    if (options?.limit !== undefined) {
      query = query.limit(options.limit);
    }
    if (options?.offset !== undefined) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as T[];
      })
    );
  }

  getById<T>(table: string, id: string): Observable<T | null> {
    return from(
      this.supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as T;
      })
    );
  }

  insert<T>(table: string, data: Partial<T>): Observable<T> {
    return from(
      this.supabase
        .from(table)
        .insert(data)
        .select()
        .single()
    ).pipe(
      map(({ data: result, error }) => {
        if (error) throw error;
        return result as T;
      })
    );
  }

  update<T>(table: string, id: string, data: Partial<T>): Observable<T> {
    return from(
      this.supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data: result, error }) => {
        if (error) throw error;
        return result as T;
      })
    );
  }

  delete(table: string, id: string): Observable<void> {
    return from(
      this.supabase
        .from(table)
        .delete()
        .eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return undefined;
      })
    );
  }

  execute<T>(query: string, params?: any[]): Observable<T[]> {
    // Para queries personalizados usando RPC
    return from(
      this.supabase.rpc(query, params?.[0] || {})
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as T[];
      })
    );
  }
}

