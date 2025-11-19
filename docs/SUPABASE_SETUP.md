# 🚀 Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: `fitness-booking`
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Select closest to you
   - **Plan**: Free tier
5. Click **"Create new project"** (takes 1-2 minutes)

## Step 2: Get Your API Keys

Once your project is created:

1. Go to **Settings** (gear icon on left sidebar)
2. Click **API** section
3. You'll see:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Update Environment Files

Copy these values to:

**File**: `src/environments/environment.development.ts`
```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'https://YOUR_PROJECT.supabase.co', // ← Your Project URL
    anonKey: 'eyJhbGci...', // ← Your anon public key
  },
};
```

**File**: `src/environments/environment.ts`
```typescript
export const environment = {
  production: true,
  supabase: {
    url: 'https://YOUR_PROJECT.supabase.co',
    anonKey: 'eyJhbGci...',
  },
};
```

## Step 3: Create Database Schema

1. Go to **SQL Editor** (in left sidebar)
2. Click **"New query"**
3. Copy and paste the SQL from `docs/DATABASE.md`

### SQL Script to Run

Run these scripts in order:

### 3.1 Create Enums

```sql
CREATE TYPE user_role AS ENUM ('business_owner', 'athlete', 'trainer');
CREATE TYPE booking_status AS ENUM ('confirmed', 'cancelled', 'waitlist', 'completed');
```

### 3.2 Create Tables

```sql
-- Boxes table
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
  
  UNIQUE(owner_id)
);

-- Profiles table
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
  
  CONSTRAINT athlete_must_have_box CHECK (
    role != 'athlete' OR box_id IS NOT NULL
  )
);

-- WOD Types table
CREATE TABLE wod_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id UUID NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  icon TEXT,
  duration_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(box_id, name)
);

-- Classes table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id UUID NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
  wod_type_id UUID NOT NULL REFERENCES wod_types(id) ON DELETE CASCADE,
  trainer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 15,
  name TEXT,
  description TEXT,
  notes TEXT,
  is_cancelled BOOLEAN DEFAULT false,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT no_time_overlap UNIQUE(box_id, wod_type_id, date, start_time)
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status booking_status NOT NULL DEFAULT 'confirmed',
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  checked_in BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(class_id, athlete_id)
);
```

### 3.3 Create Indexes

```sql
-- Boxes indexes
CREATE INDEX idx_boxes_owner_id ON boxes(owner_id);
CREATE INDEX idx_boxes_is_active ON boxes(is_active);

-- Profiles indexes
CREATE INDEX idx_profiles_box_id ON profiles(box_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- WOD Types indexes
CREATE INDEX idx_wod_types_box_id ON wod_types(box_id);
CREATE INDEX idx_wod_types_is_active ON wod_types(is_active);

-- Classes indexes
CREATE INDEX idx_classes_box_id ON classes(box_id);
CREATE INDEX idx_classes_wod_type_id ON classes(wod_type_id);
CREATE INDEX idx_classes_date ON classes(date);
CREATE INDEX idx_classes_date_box ON classes(date, box_id);
CREATE INDEX idx_classes_trainer_id ON classes(trainer_id);

-- Bookings indexes
CREATE INDEX idx_bookings_class_id ON bookings(class_id);
CREATE INDEX idx_bookings_athlete_id ON bookings(athlete_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
```

### 3.4 Create Triggers

```sql
-- Update updated_at function
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

## Step 4: Enable Row Level Security

1. Stay in **SQL Editor**
2. Run this script:

```sql
-- Enable RLS on all tables
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wod_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
```

### Create RLS Policies

**For full policies, see `docs/DATABASE.md` section "Row Level Security"**

Basic policies to start:

```sql
-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- More policies will be added as needed
```

## Step 5: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Under **Email Auth**:
   - ✅ Enable email provider
   - ✅ Confirm email: Optional (disable for development)
3. Under **Auth providers**:
   - You can add Google, GitHub, etc. later

## Step 6: Add Sample Data (Optional)

```sql
-- This will be done through the app, but you can add test data here
```

## Step 7: Test Connection

Once you've updated the environment files:

1. Restart your Angular dev server: `npm start`
2. Open browser console
3. You should see no connection errors

## Verification Checklist

- [ ] Supabase project created
- [ ] API keys copied to environment files
- [ ] All tables created
- [ ] Indexes created
- [ ] Triggers created
- [ ] RLS enabled
- [ ] Authentication configured
- [ ] Angular app can connect (no errors in console)

## Next Steps

After Supabase is configured:

1. Create login/register pages
2. Test authentication flow
3. Create first business owner + box
4. Add WOD types
5. Schedule classes
6. Test booking flow

## Troubleshooting

### "relation does not exist"
- Make sure you ran all SQL scripts in order
- Check in **Table Editor** that tables were created

### "JWT expired" or auth errors
- Check that your API keys are correct
- Make sure you're using the **anon public** key, not the service role key

### "RLS policy violation"
- Make sure RLS policies are created
- Check that the policy conditions match your use case

### Connection errors
- Verify Project URL is correct (including https://)
- Verify anon key is complete (very long string)
- Check browser console for specific error messages

## Useful Supabase Features

### Table Editor
- Visual interface to view/edit data
- Go to **Table Editor** in sidebar

### API Docs
- Auto-generated API documentation
- Go to **API** in sidebar
- See all available endpoints

### Database
- View tables, relationships, and policies
- Go to **Database** in sidebar

### SQL Editor
- Run custom queries
- Save frequently used queries

---

**Done?** Update `PROJECT_STATUS.md` and mark "Backend Setup" as complete! ✅

