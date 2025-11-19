# 🗄️ Database Schema - Fitness Booking

## Overview

Multi-tenant system where each Box (gym/business) operates independently with custom WOD types and scheduling.

## User Roles

- **Business Owner**: Creates and manages a box, defines WOD types, schedules classes
- **Athlete**: Member of a box, can book classes
- **Trainer** (future): Can be assigned to teach classes

## 📊 Database Tables

### 1. `boxes` - Gymnasiums/Businesses

Represents each CrossFit box or gym in the system.

```sql
CREATE TABLE boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(owner_id) -- Un owner solo puede tener un box (por ahora)
);

-- Indexes
CREATE INDEX idx_boxes_owner_id ON boxes(owner_id);
CREATE INDEX idx_boxes_is_active ON boxes(is_active);
```

**Settings JSONB structure:**
```json
{
  "timezone": "Europe/Madrid",
  "currency": "EUR",
  "booking_window_days": 7,
  "cancellation_hours": 24,
  "max_bookings_per_day": 3
}
```

### 2. `profiles` - User Profiles

Extends Supabase auth.users with additional information.

```sql
CREATE TYPE user_role AS ENUM ('business_owner', 'athlete', 'trainer');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'athlete',
  box_id UUID REFERENCES boxes(id) ON DELETE SET NULL,
  emergency_contact TEXT,
  birth_date DATE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Un athlete debe pertenecer a un box
  CONSTRAINT athlete_must_have_box CHECK (
    role != 'athlete' OR box_id IS NOT NULL
  )
);

-- Indexes
CREATE INDEX idx_profiles_box_id ON profiles(box_id);
CREATE INDEX idx_profiles_role ON profiles(role);
```

### 3. `wod_types` - Types of WODs (Custom per Box)

Each box defines their own WOD types.

```sql
CREATE TABLE wod_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id UUID NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1', -- For UI representation
  icon TEXT, -- Icon name or emoji
  duration_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(box_id, name) -- No duplicate WOD names per box
);

-- Indexes
CREATE INDEX idx_wod_types_box_id ON wod_types(box_id);
CREATE INDEX idx_wod_types_is_active ON wod_types(is_active);
```

**Example records:**
```sql
-- Box 1 WODs
INSERT INTO wod_types (box_id, name, description, color, icon) VALUES
  ('box-uuid', 'Endurance', 'Cardio and stamina focused', '#10b981', '🏃'),
  ('box-uuid', 'Halterofilia', 'Olympic weightlifting', '#f59e0b', '🏋️'),
  ('box-uuid', 'CrossTraining', 'Mixed functional fitness', '#6366f1', '💪');
```

### 4. `classes` - Scheduled Classes

Specific class instances scheduled by the business owner.

```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id UUID NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
  wod_type_id UUID NOT NULL REFERENCES wod_types(id) ON DELETE CASCADE,
  trainer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Scheduling
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  -- Capacity
  max_capacity INTEGER NOT NULL DEFAULT 15,
  
  -- Optional details
  name TEXT, -- Optional custom name for the class
  description TEXT, -- WOD details, movements, etc.
  notes TEXT, -- Special notes (e.g., "Bring your own rope")
  
  -- Status
  is_cancelled BOOLEAN DEFAULT false,
  cancellation_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- No overlapping classes for the same WOD type
  CONSTRAINT no_time_overlap UNIQUE(box_id, wod_type_id, date, start_time)
);

-- Indexes
CREATE INDEX idx_classes_box_id ON classes(box_id);
CREATE INDEX idx_classes_wod_type_id ON classes(wod_type_id);
CREATE INDEX idx_classes_date ON classes(date);
CREATE INDEX idx_classes_date_box ON classes(date, box_id);
CREATE INDEX idx_classes_trainer_id ON classes(trainer_id);
```

### 5. `bookings` - Class Reservations

Athletes booking specific classes.

```sql
CREATE TYPE booking_status AS ENUM ('confirmed', 'cancelled', 'waitlist', 'completed');

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  status booking_status NOT NULL DEFAULT 'confirmed',
  
  -- Timestamps
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  
  -- Attendance
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Un athlete no puede reservar la misma clase dos veces
  UNIQUE(class_id, athlete_id)
);

-- Indexes
CREATE INDEX idx_bookings_class_id ON bookings(class_id);
CREATE INDEX idx_bookings_athlete_id ON bookings(athlete_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
```

## 🔐 Row Level Security (RLS) Policies

### Boxes

```sql
-- Business owners can see their own box
CREATE POLICY "Owners can view their box"
  ON boxes FOR SELECT
  USING (auth.uid() = owner_id);

-- Business owners can update their box
CREATE POLICY "Owners can update their box"
  ON boxes FOR UPDATE
  USING (auth.uid() = owner_id);

-- Athletes can view their box
CREATE POLICY "Athletes can view their box"
  ON boxes FOR SELECT
  USING (
    id IN (
      SELECT box_id FROM profiles WHERE id = auth.uid()
    )
  );
```

### Profiles

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Athletes can view other athletes in their box
CREATE POLICY "Athletes can view box members"
  ON profiles FOR SELECT
  USING (
    box_id IN (
      SELECT box_id FROM profiles WHERE id = auth.uid()
    )
  );
```

### WOD Types

```sql
-- Box members can view WOD types of their box
CREATE POLICY "Box members can view WOD types"
  ON wod_types FOR SELECT
  USING (
    box_id IN (
      SELECT box_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT id FROM boxes WHERE owner_id = auth.uid()
    )
  );

-- Only box owner can manage WOD types
CREATE POLICY "Owners can manage WOD types"
  ON wod_types FOR ALL
  USING (
    box_id IN (
      SELECT id FROM boxes WHERE owner_id = auth.uid()
    )
  );
```

### Classes

```sql
-- Box members can view classes of their box
CREATE POLICY "Box members can view classes"
  ON classes FOR SELECT
  USING (
    box_id IN (
      SELECT box_id FROM profiles WHERE id = auth.uid()
      UNION
      SELECT id FROM boxes WHERE owner_id = auth.uid()
    )
  );

-- Only box owner can manage classes
CREATE POLICY "Owners can manage classes"
  ON classes FOR ALL
  USING (
    box_id IN (
      SELECT id FROM boxes WHERE owner_id = auth.uid()
    )
  );
```

### Bookings

```sql
-- Athletes can view their own bookings
CREATE POLICY "Athletes can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = athlete_id);

-- Athletes can create bookings
CREATE POLICY "Athletes can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (
    auth.uid() = athlete_id
    AND EXISTS (
      SELECT 1 FROM classes c
      INNER JOIN profiles p ON p.box_id = c.box_id
      WHERE c.id = class_id AND p.id = auth.uid()
    )
  );

-- Athletes can cancel their own bookings
CREATE POLICY "Athletes can cancel bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = athlete_id)
  WITH CHECK (status = 'cancelled');

-- Box owners can view all bookings
CREATE POLICY "Owners can view all bookings"
  ON bookings FOR SELECT
  USING (
    class_id IN (
      SELECT c.id FROM classes c
      INNER JOIN boxes b ON b.id = c.box_id
      WHERE b.owner_id = auth.uid()
    )
  );
```

## 📈 Useful Views

### Class availability

```sql
CREATE VIEW class_availability AS
SELECT 
  c.*,
  w.name as wod_name,
  w.color as wod_color,
  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as current_bookings,
  c.max_capacity - COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as spots_available
FROM classes c
LEFT JOIN wod_types w ON w.id = c.wod_type_id
LEFT JOIN bookings b ON b.class_id = c.id
WHERE c.is_cancelled = false
GROUP BY c.id, w.name, w.color;
```

## 🔄 Triggers

### Update updated_at timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_boxes_updated_at
  BEFORE UPDATE ON boxes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_wod_types_updated_at
  BEFORE UPDATE ON wod_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

## 📊 Sample Data Flow

### 1. Business Owner creates a box
```
User signs up → Profile created with role='business_owner' → Creates Box
```

### 2. Business Owner sets up WOD types
```
Creates: "Endurance", "Halterofilia", "CrossTraining"
```

### 3. Business Owner schedules classes
```
Monday 18:00 - Endurance
Monday 19:00 - CrossTraining
Tuesday 18:00 - Halterofilia
...
```

### 4. Athlete joins
```
User signs up → Profile created with role='athlete' → Joins a Box
```

### 5. Athlete books a class
```
Views available classes → Books "Monday 18:00 Endurance" → Booking created
```

## 🔍 Important Queries

### Get available classes for an athlete

```sql
SELECT 
  c.*,
  wt.name as wod_name,
  wt.color as wod_color,
  COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as current_bookings,
  c.max_capacity - COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as spots_available,
  EXISTS(
    SELECT 1 FROM bookings
    WHERE class_id = c.id AND athlete_id = $1 AND status = 'confirmed'
  ) as user_has_booked
FROM classes c
INNER JOIN wod_types wt ON wt.id = c.wod_type_id
INNER JOIN profiles p ON p.box_id = c.box_id
LEFT JOIN bookings b ON b.class_id = c.id
WHERE p.id = $1
  AND c.date >= CURRENT_DATE
  AND c.is_cancelled = false
GROUP BY c.id, wt.name, wt.color
HAVING COUNT(b.id) FILTER (WHERE b.status = 'confirmed') < c.max_capacity
ORDER BY c.date, c.start_time;
```

### Check if athlete can book a class

```sql
SELECT 
  c.max_capacity > COUNT(b.id) FILTER (WHERE b.status = 'confirmed') as has_spots,
  NOT EXISTS(
    SELECT 1 FROM bookings
    WHERE class_id = $1 AND athlete_id = $2 AND status = 'confirmed'
  ) as not_already_booked,
  c.box_id = (SELECT box_id FROM profiles WHERE id = $2) as same_box
FROM classes c
LEFT JOIN bookings b ON b.class_id = c.id
WHERE c.id = $1
GROUP BY c.id;
```

## 🚀 Next Steps

1. Create Supabase project
2. Run these SQL scripts
3. Set up authentication
4. Create TypeScript interfaces matching this schema
5. Build the services layer

