# 🎲 Test Data - Datos de Prueba

Este documento contiene los scripts SQL para insertar datos de prueba en Supabase.

---

## 📋 Pre-requisitos

Antes de ejecutar estos scripts:

1. ✅ Supabase project created
2. ✅ Database schema created (all 5 tables)
3. ✅ RLS policies configured
4. ✅ Test user created in Authentication

---

## 👤 Crear Usuario de Prueba

### Opción 1: Desde UI (Recomendado)

1. Ve a **Authentication** → **Users**
2. Click **"Add user"**
3. Rellena:
   - Email: `owner@test.com`
   - Password: `password123`
   - **Auto Confirm User**: ✅ Activar
4. Click **"Create user"**
5. **Copia el UUID** del usuario creado

### Opción 2: SQL Query

```sql
-- Ver usuarios existentes
SELECT id, email FROM auth.users;
```

---

## 🗄️ Script de Datos de Prueba

Reemplaza `YOUR_USER_UUID` con el UUID del usuario creado.

```sql
-- ============================================
-- DATOS DE PRUEBA - FITNESS BOOKING
-- ============================================

-- 1. Crear perfil del business owner
INSERT INTO profiles (id, full_name, role, phone)
VALUES (
  'YOUR_USER_UUID', -- Reemplazar con UUID real
  'Juan Pérez',
  'business_owner',
  '+34 600 123 456'
);

-- 2. Crear un box
INSERT INTO boxes (id, owner_id, name, description, address, phone, email)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'YOUR_USER_UUID', -- Reemplazar con UUID real
  'CrossFit Madrid Centro',
  'El mejor box de CrossFit en el centro de Madrid. Entrenadores certificados y ambiente familiar.',
  'Calle Gran Vía 123, Madrid',
  '+34 910 123 456',
  'info@crossfitmadrid.com'
);

-- 3. Crear tipos de WOD
INSERT INTO wod_types (box_id, name, description, color, icon, duration_minutes, display_order) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Endurance', 'Entrenamiento cardiovascular de alta intensidad', '#10b981', '🏃', 60, 1),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Halterofilia', 'Levantamiento olímpico y técnica', '#f59e0b', '🏋️', 90, 2),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'CrossTraining', 'WOD funcional mixto', '#6366f1', '💪', 60, 3),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Gimnasia', 'Movimientos gimnásticos y skills', '#ec4899', '🤸', 60, 4);

-- 4. Crear clases programadas (próximos 3 días)
INSERT INTO classes (box_id, wod_type_id, date, start_time, end_time, max_capacity, description) 
VALUES
  -- Hoy
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 
   (SELECT id FROM wod_types WHERE name = 'CrossTraining' LIMIT 1),
   CURRENT_DATE, '18:00:00', '19:00:00', 15,
   'AMRAP 20min: 5 Pull-ups, 10 Push-ups, 15 Air Squats'),
  
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479',
   (SELECT id FROM wod_types WHERE name = 'Halterofilia' LIMIT 1),
   CURRENT_DATE, '19:30:00', '21:00:00', 12,
   'Snatch técnica y fuerza: 5x3 al 80%'),
  
  -- Mañana
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479',
   (SELECT id FROM wod_types WHERE name = 'Endurance' LIMIT 1),
   CURRENT_DATE + 1, '09:00:00', '10:00:00', 15,
   '5K Run for time'),
  
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479',
   (SELECT id FROM wod_types WHERE name = 'CrossTraining' LIMIT 1),
   CURRENT_DATE + 1, '18:00:00', '19:00:00', 15,
   'Fran: 21-15-9 Thrusters (43kg) / Pull-ups'),
  
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479',
   (SELECT id FROM wod_types WHERE name = 'Gimnasia' LIMIT 1),
   CURRENT_DATE + 1, '19:30:00', '20:30:00', 10,
   'Handstand practice y Muscle-up progressions'),
  
  -- Pasado mañana
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479',
   (SELECT id FROM wod_types WHERE name = 'CrossTraining' LIMIT 1),
   CURRENT_DATE + 2, '10:00:00', '11:00:00', 15,
   'Cindy: 20min AMRAP - 5 Pull-ups, 10 Push-ups, 15 Squats'),
  
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479',
   (SELECT id FROM wod_types WHERE name = 'Endurance' LIMIT 1),
   CURRENT_DATE + 2, '18:00:00', '19:00:00', 15,
   'Row 2000m + 100 Burpees for time');

-- Verificar datos insertados
SELECT 'Profiles' as tabla, COUNT(*) as registros FROM profiles
UNION ALL
SELECT 'Boxes', COUNT(*) FROM boxes
UNION ALL
SELECT 'WOD Types', COUNT(*) FROM wod_types
UNION ALL
SELECT 'Classes', COUNT(*) FROM classes;
```

---

## 🔓 Políticas RLS para Desarrollo

Para permitir lectura sin autenticación (útil durante desarrollo):

```sql
-- ============================================
-- POLÍTICAS RLS PARA TESTING/DESARROLLO
-- ============================================

-- Permitir lectura pública de boxes
CREATE POLICY "Public read boxes"
  ON boxes FOR SELECT
  USING (true);

-- Permitir lectura pública de wod_types
CREATE POLICY "Public read wod_types"
  ON wod_types FOR SELECT
  USING (true);

-- Permitir lectura pública de classes
CREATE POLICY "Public read classes"
  ON classes FOR SELECT
  USING (true);

-- Permitir lectura pública de bookings
CREATE POLICY "Public read bookings"
  ON bookings FOR SELECT
  USING (true);

-- Verificar políticas creadas
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

---

## ✅ Verificación

### En Table Editor

Verifica que tienes:
- **profiles**: 1 registro
- **boxes**: 1 registro
- **wod_types**: 4 registros
- **classes**: 7 registros

### En Angular

Abre `http://localhost:4200` y verifica en la consola:

```
✅ Clases obtenidas: 2 (o más, dependiendo de la fecha)
✅ Box obtenido: { name: 'CrossFit Madrid Centro', ... }
```

---

## 🧹 Limpiar Datos de Prueba

Si necesitas borrar los datos de prueba:

```sql
-- ⚠️ CUIDADO: Esto borrará todos los datos

DELETE FROM bookings;
DELETE FROM classes;
DELETE FROM wod_types;
DELETE FROM boxes;
DELETE FROM profiles WHERE role = 'business_owner';

-- Verificar que todo esté limpio
SELECT 'Profiles' as tabla, COUNT(*) FROM profiles
UNION ALL
SELECT 'Boxes', COUNT(*) FROM boxes
UNION ALL
SELECT 'WOD Types', COUNT(*) FROM wod_types
UNION ALL
SELECT 'Classes', COUNT(*) FROM classes
UNION ALL
SELECT 'Bookings', COUNT(*) FROM bookings;
```

---

## 📊 Datos de Prueba Actuales

**Creado**: 2025-11-20

**Box de prueba:**
- Nombre: CrossFit Madrid Centro
- UUID: `f47ac10b-58cc-4372-a567-0e02b2c3d479`
- Owner: Juan Pérez (UUID: `8a51ff55-1fdb-46a1-9874-ce066a577f6d`)

**WOD Types:**
1. Endurance (🏃)
2. Halterofilia (🏋️)
3. CrossTraining (💪)
4. Gimnasia (🤸)

**Clases programadas:**
- 2 clases hoy
- 3 clases mañana
- 2 clases pasado mañana

---

## 🔄 Agregar Más Datos de Prueba

### Crear Atletas

```sql
-- Insertar atletas de prueba
INSERT INTO profiles (id, full_name, role, box_id, phone)
VALUES 
  (gen_random_uuid(), 'María García', 'athlete', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '+34 600 111 222'),
  (gen_random_uuid(), 'Pedro López', 'athlete', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '+34 600 333 444'),
  (gen_random_uuid(), 'Ana Martínez', 'athlete', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', '+34 600 555 666');
```

### Crear Reservas

```sql
-- Insertar reservas de prueba
INSERT INTO bookings (class_id, athlete_id, status)
SELECT 
  c.id as class_id,
  p.id as athlete_id,
  'confirmed' as status
FROM classes c
CROSS JOIN profiles p
WHERE p.role = 'athlete'
  AND c.date = CURRENT_DATE
LIMIT 5;
```

---

## 💡 Tips

- **IDs Fijos**: Usamos un UUID fijo para el box (`f47ac10b...`) para facilitar los tests
- **CURRENT_DATE**: Las fechas son relativas al día actual, siempre tendrás clases "de hoy"
- **RLS Policies**: Las políticas públicas son solo para desarrollo, en producción serán más restrictivas

---

**Para reinsertar datos después de limpiar**, simplemente ejecuta de nuevo el script principal reemplazando el UUID del usuario.

