# 🛡️ Service Abstraction Layer

## ¿Por qué Abstracción?

La capa de abstracción nos permite cambiar de backend (Supabase → API propia) sin tocar los componentes.

---

## 📊 Arquitectura en Capas

```
┌─────────────────────────────────────┐
│        COMPONENTS (UI)              │
│   Login, Dashboard, ClassList, etc  │
└──────────────┬──────────────────────┘
               │ Usa
┌──────────────▼──────────────────────┐
│      DOMAIN SERVICES                │
│  ClassService, BookingService, etc  │
│  (Lógica de negocio)                │
└──────────────┬──────────────────────┘
               │ Usa
┌──────────────▼──────────────────────┐
│     ABSTRACTION INTERFACES          │
│  IAuthService, IDatabaseService     │
│  (Contratos, NO implementación)     │
└──────────────┬──────────────────────┘
               │ Implementado por
┌──────────────▼──────────────────────┐
│    IMPLEMENTATION SERVICES          │
│  SupabaseAuthService                │
│  SupabaseDatabaseService            │
│  (Supabase específico)              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│           SUPABASE                  │
│  PostgreSQL + Auth + Storage        │
└─────────────────────────────────────┘
```

---

## ❌ Código MAL (Acoplado a Supabase)

```typescript
// ❌ En un componente - MAL
export class ClassListComponent {
  classes = signal<Class[]>([]);

  async loadClasses() {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from('classes')
      .select('*')
      .eq('date', this.selectedDate);
    
    this.classes.set(data);
  }
}
```

**Problemas:**
- El componente conoce Supabase directamente
- Si cambias de backend, debes modificar TODOS los componentes
- Difícil de testear (necesitas Supabase en los tests)
- Mezcla lógica de UI con lógica de datos

---

## ✅ Código BIEN (Con Abstracción)

```typescript
// ✅ En un componente - BIEN
export class ClassListComponent {
  private classService = inject(ClassService); // Inyecta el servicio
  classes = signal<Class[]>([]);

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.classService.getClassesByDate(this.selectedDate())
      .subscribe(classes => {
        this.classes.set(classes);
      });
  }
}
```

**Ventajas:**
- El componente NO sabe que existe Supabase
- Si cambias de backend, solo modificas `ClassService`
- Fácil de testear (mock del `ClassService`)
- Separación de responsabilidades clara

---

## 📦 Servicios Creados

### 1. **SupabaseDatabaseService** (Implementación)
**Ubicación**: `src/app/core/services/supabase-database.service.ts`

**Responsabilidad**: Implementa `IDatabaseService` usando Supabase

```typescript
// Operaciones CRUD genéricas
query<T>(table, options)      // SELECT con filtros
getById<T>(table, id)         // SELECT por ID
insert<T>(table, data)        // INSERT
update<T>(table, id, data)    // UPDATE
delete(table, id)             // DELETE
```

---

### 2. **ClassService** (Dominio)
**Ubicación**: `src/app/core/services/class.service.ts`

**Responsabilidad**: Lógica de negocio para clases

```typescript
getClassesByBox(boxId)              // Clases de un box
getClassesByDate(date)              // Clases de una fecha
getAvailableClasses(boxId, date)    // Clases disponibles con detalles
createClass(boxId, data)            // Crear clase
updateClass(id, data)               // Actualizar clase
cancelClass(id, reason)             // Cancelar clase
checkAvailability(classId)          // Verificar disponibilidad
```

**Uso en componentes:**
```typescript
export class ClassListComponent {
  private classService = inject(ClassService);

  loadClasses() {
    this.classService.getClassesByDate('2025-01-20')
      .subscribe(classes => {
        console.log('Clases:', classes);
      });
  }
}
```

---

### 3. **BookingService** (Dominio)
**Ubicación**: `src/app/core/services/booking.service.ts`

**Responsabilidad**: Lógica de negocio para reservas

```typescript
getMyBookings(athleteId)              // Mis reservas
getClassBookings(classId)             // Reservas de una clase
createBooking(athleteId, data)        // Crear reserva
cancelBooking(id, reason)             // Cancelar reserva
checkIn(id)                           // Check-in
```

**Uso en componentes:**
```typescript
export class MyBookingsComponent {
  private bookingService = inject(BookingService);
  private authService = inject(SupabaseAuthService);

  loadMyBookings() {
    this.authService.getCurrentUser().pipe(
      switchMap(user => 
        this.bookingService.getMyBookings(user!.id)
      )
    ).subscribe(bookings => {
      console.log('Mis reservas:', bookings);
    });
  }
}
```

---

### 4. **BoxService** (Dominio)
**Ubicación**: `src/app/core/services/box.service.ts`

**Responsabilidad**: Lógica de negocio para boxes

```typescript
getMyBox(ownerId)           // Mi box
getBoxById(id)              // Box por ID
createBox(ownerId, data)    // Crear box
updateBox(id, data)         // Actualizar box
deactivateBox(id)           // Desactivar box
```

---

## 🔄 Migración Futura

Si en el futuro decides migrar de Supabase a tu propio backend:

### Paso 1: Crear nueva implementación
```typescript
// custom-database.service.ts
export class CustomDatabaseService implements IDatabaseService {
  private http = inject(HttpClient);

  query<T>(table: string, options?: QueryOptions): Observable<T[]> {
    // Ahora usa tu API REST
    return this.http.get<T[]>(`/api/${table}`, { params: options });
  }

  // ... implementar resto de métodos
}
```

### Paso 2: Cambiar el provider
```typescript
// app.config.ts
providers: [
  // Cambia de Supabase a Custom
  { provide: SupabaseDatabaseService, useClass: CustomDatabaseService }
]
```

### Paso 3: Listo!
- **Los componentes NO cambian**
- **Los servicios de dominio NO cambian**
- Solo cambiaste la implementación

---

## 🧪 Testing

Con abstracción, el testing es mucho más fácil:

```typescript
describe('ClassListComponent', () => {
  let component: ClassListComponent;
  let mockClassService: jasmine.SpyObj<ClassService>;

  beforeEach(() => {
    mockClassService = jasmine.createSpyObj('ClassService', ['getClassesByDate']);
    mockClassService.getClassesByDate.and.returnValue(of([
      { id: '1', name: 'CrossFit WOD', /* ... */ }
    ]));

    TestBed.configureTestingModule({
      providers: [
        { provide: ClassService, useValue: mockClassService }
      ]
    });
  });

  it('should load classes', () => {
    component.loadClasses();
    expect(mockClassService.getClassesByDate).toHaveBeenCalled();
    expect(component.classes().length).toBe(1);
  });
});
```

---

## 📝 Reglas de Uso

### ✅ DO (Hacer)
1. **Componentes** → Inyectan **Domain Services** (`ClassService`, `BookingService`)
2. **Domain Services** → Usan **Implementation Services** (`SupabaseDatabaseService`)
3. **Implementation Services** → Acceden a **Supabase/Backend**

### ❌ DON'T (No hacer)
1. **NO** uses `getSupabaseClient()` en componentes
2. **NO** uses `getSupabaseClient()` en páginas
3. **NO** hagas queries de Supabase fuera de los servicios
4. Solo usa Supabase directamente en: **Implementation Services** y **tests de conexión**

---

## 🎯 Ejemplo Completo

### Componente (UI)
```typescript
@Component({
  selector: 'app-class-list',
  template: `
    <div class="class-list">
      @for (class of classes(); track class.id) {
        <div class="class-card">
          <h3>{{ class.name }}</h3>
          <p>{{ class.date }} - {{ class.start_time }}</p>
          <fb-button (click)="bookClass(class.id)">
            Reservar
          </fb-button>
        </div>
      }
    </div>
  `
})
export class ClassListComponent {
  private classService = inject(ClassService);
  private bookingService = inject(BookingService);
  
  classes = signal<Class[]>([]);

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.classService.getClassesByDate('2025-01-20')
      .subscribe(classes => this.classes.set(classes));
  }

  bookClass(classId: string) {
    this.bookingService.createBooking(this.currentUserId, {
      class_id: classId
    }).subscribe({
      next: () => alert('¡Reserva exitosa!'),
      error: (err) => alert('Error: ' + err.message)
    });
  }
}
```

---

## 🎊 Resumen

| Capa | Responsabilidad | Conoce Supabase? |
|------|----------------|------------------|
| **Components** | UI y experiencia de usuario | ❌ NO |
| **Domain Services** | Lógica de negocio | ❌ NO |
| **Interface** | Contrato (abstracción) | ❌ NO |
| **Implementation** | Acceso a datos | ✅ SÍ |
| **Supabase** | Base de datos | N/A |

**Con esta arquitectura:**
- ✅ Código mantenible
- ✅ Fácil de testear
- ✅ Fácil de migrar
- ✅ Separación de responsabilidades
- ✅ Escalable

---

**¿Listo para crear tu primera página usando estos servicios?** 🚀

