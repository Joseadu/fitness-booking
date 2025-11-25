// ============================================
// SERVICES BARREL EXPORT
// ============================================

// Interfaces (abstracciones)
export * from './auth.interface';
export * from './database.interface';

// Implementaciones (Supabase)
export * from './supabase-auth.service';
export * from './supabase-database.service';
export * from './supabase.client';

// Domain Services (usan abstracción)
export * from './box.service';
export * from './class.service';
export * from './booking.service';

// State Management
export * from './auth-state.service';

