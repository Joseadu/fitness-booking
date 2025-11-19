// ============================================
// BOOKING SERVICE - Domain Service
// ============================================

import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking, CreateBookingDto, UpdateBookingDto, BookingStatus } from '../models';
import { SupabaseDatabaseService } from './supabase-database.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private db = inject(SupabaseDatabaseService);

  /**
   * Obtener reservas de un atleta
   */
  getMyBookings(athleteId: string): Observable<Booking[]> {
    return this.db.query<Booking>('bookings', {
      filter: { athlete_id: athleteId },
      order: { column: 'created_at', ascending: false }
    });
  }

  /**
   * Obtener reservas de una clase
   */
  getClassBookings(classId: string): Observable<Booking[]> {
    return this.db.query<Booking>('bookings', {
      filter: { class_id: classId },
      order: { column: 'booked_at', ascending: true }
    });
  }

  /**
   * Crear reserva
   */
  createBooking(athleteId: string, bookingData: CreateBookingDto): Observable<Booking> {
    return this.db.insert<Booking>('bookings', {
      ...bookingData,
      athlete_id: athleteId,
      status: 'confirmed' as BookingStatus
    });
  }

  /**
   * Cancelar reserva
   */
  cancelBooking(id: string, reason?: string): Observable<Booking> {
    return this.db.update<Booking>('bookings', id, {
      status: 'cancelled' as BookingStatus,
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason
    });
  }

  /**
   * Check-in de atleta
   */
  checkIn(id: string): Observable<Booking> {
    return this.db.update<Booking>('bookings', id, {
      checked_in: true,
      checked_in_at: new Date().toISOString()
    });
  }

  /**
   * Eliminar reserva
   */
  deleteBooking(id: string): Observable<void> {
    return this.db.delete('bookings', id);
  }
}

