# 🔐 Security TODO - Antes del Lanzamiento Público

Este documento registra todas las medidas de seguridad que se deshabilitaron temporalmente durante el desarrollo y que **DEBEN** habilitarse antes de permitir usuarios externos.

## ⚠️ CRÍTICO - Arreglar antes de producción

### 1. **Row Level Security (RLS) en tabla `profiles`**

**Estado actual:** ❌ **DESHABILITADO**

```sql
-- Actualmente ejecutado:
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

**Riesgo:**
- Cualquier usuario autenticado puede leer TODOS los perfiles
- Puede ver emails, teléfonos, nombres de todos los usuarios
- Puede modificar perfiles de otros usuarios
- **GRAVEDAD: ALTA** 🔴

**Solución a implementar:**

```sql
-- 1. Rehabilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Políticas correctas
-- Permitir a service_role (para triggers)
CREATE POLICY "Enable insert for service role"
ON profiles FOR INSERT
TO service_role
WITH CHECK (true);

-- Usuarios solo pueden leer su propio perfil
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Usuarios solo pueden insertar su propio perfil
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

---

### 2. **Constraint `athlete_must_have_box`**

**Estado actual:** ❌ **ELIMINADO**

```sql
-- Actualmente ejecutado:
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS athlete_must_have_box;
```

**Riesgo:**
- Atletas sin box asignado
- Usuarios "huérfanos" sin poder reservar clases
- **GRAVEDAD: MEDIA** 🟡

**Solución a implementar:**

1. Implementar selección de box en el registro de atletas
2. Implementar asignación de box a atletas existentes
3. Rehabilitar el constraint:

```sql
ALTER TABLE profiles 
ADD CONSTRAINT athlete_must_have_box 
CHECK (role != 'athlete' OR box_id IS NOT NULL);
```

---

### 3. **Políticas públicas en otras tablas**

**Estado actual:** ⚠️ **ACCESO PÚBLICO DE LECTURA**

```sql
-- Políticas actuales (temporales para desarrollo):
CREATE POLICY "Public read boxes" ON boxes FOR SELECT USING (true);
CREATE POLICY "Public read wod_types" ON wod_types FOR SELECT USING (true);
CREATE POLICY "Public read classes" ON classes FOR SELECT USING (true);
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);
```

**Riesgo:**
- Usuarios no autenticados pueden ver todos los boxes
- Pueden ver clases y bookings de todos
- Pueden ver información de negocio de competidores
- **GRAVEDAD: MEDIA** 🟡

**Solución a implementar:**

```sql
-- Eliminar políticas públicas
DROP POLICY IF EXISTS "Public read boxes" ON boxes;
DROP POLICY IF EXISTS "Public read wod_types" ON wod_types;
DROP POLICY IF EXISTS "Public read classes" ON classes;
DROP POLICY IF EXISTS "Public read bookings" ON bookings;

-- Boxes: solo el owner y sus atletas pueden verlo
CREATE POLICY "Box owners can manage their box"
ON boxes FOR ALL
TO authenticated
USING (owner_id = auth.uid() OR id IN (
  SELECT box_id FROM profiles WHERE id = auth.uid()
));

-- WOD Types: solo el owner del box puede verlos/gestionarlos
CREATE POLICY "Box owners manage wod types"
ON wod_types FOR ALL
TO authenticated
USING (box_id IN (
  SELECT id FROM boxes WHERE owner_id = auth.uid()
) OR box_id IN (
  SELECT box_id FROM profiles WHERE id = auth.uid()
));

-- Classes: usuarios autenticados del box pueden verlas
CREATE POLICY "Users can view classes in their box"
ON classes FOR SELECT
TO authenticated
USING (box_id IN (
  SELECT box_id FROM profiles WHERE id = auth.uid()
));

-- Bookings: usuarios solo pueden ver sus propias reservas
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR class_id IN (
  SELECT id FROM classes WHERE box_id IN (
    SELECT id FROM boxes WHERE owner_id = auth.uid()
  )
));
```

---

## 🛡️ Otras consideraciones de seguridad

### 4. **Environment variables en Git**

**Estado actual:** ✅ **CORRECTO**

- `environment.ts` y `environment.development.ts` están en `.gitignore`
- Solo los `.template.ts` están versionados
- Claves de Supabase protegidas

**Acción:** ✅ Ninguna, está bien configurado

---

### 5. **HTTPS en producción**

**Estado actual:** ⚠️ **HTTP (No es seguro)**

- URL: `http://fitness-booking.joseadu.com`
- Debería ser: `https://fitness-booking.joseadu.com`

**Riesgo:**
- Passwords viajan en texto plano
- Tokens de sesión expuestos
- **GRAVEDAD: ALTA** 🔴

**Solución:**
- Configurar certificado SSL en IONOS
- Forzar redirección HTTP → HTTPS

---

### 6. **Email confirmation**

**Estado actual:** ⚠️ **Confirmación requerida pero no validada en frontend**

Los usuarios deben confirmar email, pero la app no verifica si está confirmado antes de dar acceso.

**Solución a implementar:**
- Verificar `email_confirmed_at` después del login
- Mostrar mensaje si el email no está confirmado
- Bloquear acceso hasta confirmar

---

## 📋 Checklist de seguridad PRE-PRODUCCIÓN

Antes de lanzar públicamente, ejecutar:

```markdown
### Database Security
- [ ] Habilitar RLS en tabla `profiles`
- [ ] Configurar políticas correctas para cada tabla
- [ ] Rehabilitar constraint `athlete_must_have_box`
- [ ] Eliminar políticas públicas temporales
- [ ] Verificar que triggers tienen permisos correctos
- [ ] Probar permisos de cada rol (Owner, Athlete)

### Application Security
- [ ] Configurar HTTPS obligatorio
- [ ] Validar email confirmado antes de dar acceso
- [ ] Implementar rate limiting en Supabase
- [ ] Revisar logs de Supabase por accesos sospechosos
- [ ] Configurar backups automáticos
- [ ] Documentar proceso de recuperación

### Infrastructure Security
- [ ] Rotar claves de API si fueron expuestas
- [ ] Configurar CORS correctamente en Supabase
- [ ] Revisar GitHub Secrets (no duplicar en repos públicos)
- [ ] Configurar alertas de errores (Sentry, LogRocket, etc.)

### Code Security
- [ ] Sanitizar inputs de usuario
- [ ] Validar todos los formularios en backend (no solo frontend)
- [ ] Implementar CSRF protection
- [ ] Revisar dependencies vulnerables (npm audit)
```

---

## 🚀 Cuándo arreglar cada cosa

### **Antes de MVP público:**
1. 🔴 Habilitar RLS en `profiles`
2. 🔴 Configurar HTTPS
3. 🟡 Eliminar políticas públicas
4. 🟡 Validar email confirmado

### **Antes de lanzamiento completo:**
5. 🟡 Rehabilitar constraint `athlete_must_have_box`
6. 🟢 Rate limiting
7. 🟢 Monitoring y alertas
8. 🟢 Backups automatizados

---

## 📞 Contacto y Recursos

- **Supabase Security Best Practices:** https://supabase.com/docs/guides/auth/row-level-security
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Angular Security Guide:** https://angular.dev/best-practices/security

---

**Última actualización:** 26 de noviembre de 2025  
**Estado:** 🟡 Desarrollo - NO apto para usuarios externos

