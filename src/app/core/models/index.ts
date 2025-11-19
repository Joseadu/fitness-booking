// ============================================
// MODELOS E INTERFACES GLOBALES
// ============================================
// Estos modelos coinciden con el schema de Supabase
// Ver: docs/DATABASE.md

// ==========================================
// ENUMS
// ==========================================

export enum UserRole {
  BUSINESS_OWNER = 'business_owner',
  ATHLETE = 'athlete',
  TRAINER = 'trainer'
}

export enum BookingStatus {
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  WAITLIST = 'waitlist',
  COMPLETED = 'completed'
}

// ==========================================
// BOX (Gymnasium/Business)
// ==========================================

export interface BoxSettings {
  timezone?: string;
  currency?: string;
  booking_window_days?: number;
  cancellation_hours?: number;
  max_bookings_per_day?: number;
}

export interface Box {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  settings?: BoxSettings;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBoxDto {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  settings?: BoxSettings;
}

export interface UpdateBoxDto extends Partial<CreateBoxDto> {
  logo_url?: string;
  is_active?: boolean;
}

// ==========================================
// PROFILE (User Profile)
// ==========================================

export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  role: UserRole;
  box_id?: string;
  emergency_contact?: string;
  birth_date?: string;
  joined_at: string;
  updated_at: string;
  
  // Relations (optional, populated by joins)
  box?: Box;
}

export interface CreateProfileDto {
  full_name: string;
  phone?: string;
  role: UserRole;
  box_id?: string;
  emergency_contact?: string;
  birth_date?: string;
}

export interface UpdateProfileDto extends Partial<CreateProfileDto> {
  avatar_url?: string;
}

// ==========================================
// WOD TYPE
// ==========================================

export interface WodType {
  id: string;
  box_id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  duration_minutes: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateWodTypeDto {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  duration_minutes?: number;
  display_order?: number;
}

export interface UpdateWodTypeDto extends Partial<CreateWodTypeDto> {
  is_active?: boolean;
}

// ==========================================
// CLASS
// ==========================================

export interface Class {
  id: string;
  box_id: string;
  wod_type_id: string;
  trainer_id?: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  max_capacity: number;
  name?: string;
  description?: string;
  notes?: string;
  is_cancelled: boolean;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  
  // Relations (optional, populated by joins)
  wod_type?: WodType;
  trainer?: Profile;
  box?: Box;
  bookings?: Booking[];
  current_bookings?: number;
  spots_available?: number;
}

export interface CreateClassDto {
  wod_type_id: string;
  date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  trainer_id?: string;
  name?: string;
  description?: string;
  notes?: string;
}

export interface UpdateClassDto extends Partial<CreateClassDto> {
  is_cancelled?: boolean;
  cancellation_reason?: string;
}

// ==========================================
// BOOKING
// ==========================================

export interface Booking {
  id: string;
  class_id: string;
  athlete_id: string;
  status: BookingStatus;
  booked_at: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  checked_in: boolean;
  checked_in_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relations (optional, populated by joins)
  class?: Class;
  athlete?: Profile;
}

export interface CreateBookingDto {
  class_id: string;
  notes?: string;
}

export interface UpdateBookingDto {
  status?: BookingStatus;
  cancellation_reason?: string;
  checked_in?: boolean;
  notes?: string;
}

// ==========================================
// VIEW MODELS (para UI)
// ==========================================

export interface ClassWithDetails extends Class {
  wod_name: string;
  wod_color: string;
  current_bookings: number;
  spots_available: number;
  user_has_booked?: boolean;
}

export interface DashboardStats {
  total_classes: number;
  total_bookings: number;
  total_athletes: number;
  upcoming_classes: number;
}

