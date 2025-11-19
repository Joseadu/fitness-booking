# 🏗️ Architecture - Fitness Booking

## System Overview

Fitness Booking is a **multi-tenant SaaS** platform that enables CrossFit boxes and functional gyms to manage their classes, WOD types, and member bookings.

## Architecture Principles

1. **Multi-tenancy**: Each box operates independently with isolated data
2. **Scalability**: Design supports hundreds of boxes with thousands of users
3. **Abstraction**: Backend services abstracted to allow future migration
4. **Component-based**: Reusable UI components with standalone architecture
5. **Type-safety**: Full TypeScript coverage

## Technology Stack

### Frontend
- **Framework**: Angular 20 (Standalone Components)
- **Language**: TypeScript 5.9
- **Styling**: SASS with custom design system
- **State Management**: Signals (Angular built-in)
- **HTTP Client**: Angular HttpClient with RxJS
- **Routing**: Angular Router

### Backend
- **BaaS**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (JWT-based)
- **Storage**: Supabase Storage (for avatars, logos)
- **Realtime**: Supabase Realtime (WebSockets)

### DevOps
- **Version Control**: Git + GitHub
- **Hosting**: TBD (Vercel/Netlify recommended)
- **CI/CD**: GitHub Actions (future)

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     USER INTERFACE                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Business   │  │   Athletes   │  │   Trainers   │  │
│  │    Owner     │  │              │  │   (future)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  ANGULAR APPLICATION                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │                   Features                        │  │
│  │  ┌────────┐ ┌────────┐ ┌─────────┐ ┌──────────┐ │  │
│  │  │  Auth  │ │ Classes│ │ Bookings│ │ Dashboard│ │  │
│  │  └────────┘ └────────┘ └─────────┘ └──────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Core Services Layer                  │  │
│  │  ┌──────────────┐  ┌──────────────┐             │  │
│  │  │ Auth Service │  │  DB Service  │ (Abstraction)│  │
│  │  └──────────────┘  └──────────────┘             │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Shared Components                      │  │
│  │  Button | Card | Input | Modal | Badge | ...     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS/WSS
┌─────────────────────▼───────────────────────────────────┐
│                     SUPABASE                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │     Auth     │  │  PostgreSQL  │  │   Storage    │  │
│  │   (JWT)      │  │   Database   │  │   (Files)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Row Level Security (RLS)              │ │
│  │         Ensures data isolation per box             │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User → Login Form → Auth Service → Supabase Auth → JWT Token
                                         ↓
                                  Set Session
                                         ↓
                              Redirect to Dashboard
```

### 2. Booking Flow (Athlete)

```
Athlete → View Classes → Class List Component
                              ↓
                        Filter by Date/WOD
                              ↓
                     Select Class → Book Button
                              ↓
                      Booking Service → Check Capacity
                              ↓
                      Create Booking → Supabase
                              ↓
                        RLS Validates
                              ↓
                      Success → Update UI
```

### 3. Class Creation Flow (Business Owner)

```
Owner → Create Class Form → Class Service
                                 ↓
                          Validate Data
                                 ↓
                    Check WOD Type exists
                                 ↓
                      Create Class → Supabase
                                 ↓
                           RLS Validates
                                 ↓
                       Success → Refresh List
```

## Service Layer Architecture

### Abstraction Pattern

All backend interactions go through abstracted service interfaces:

```typescript
// Interface (doesn't depend on Supabase)
interface IAuthService {
  login(email: string, password: string): Observable<User>;
  logout(): Observable<void>;
  getCurrentUser(): Observable<User | null>;
}

// Implementation (Supabase-specific)
class SupabaseAuthService implements IAuthService {
  // Uses Supabase client internally
}

// Future: Custom backend implementation
class CustomAuthService implements IAuthService {
  // Uses custom API
}
```

**Benefits:**
- Easy to swap backend in the future
- Better testing (mock services)
- Clear separation of concerns

## Security Architecture

### Row Level Security (RLS)

Supabase RLS ensures data isolation:

1. **Box Owners** can only access their own box data
2. **Athletes** can only access their box's data
3. **Bookings** are validated against user's box membership
4. **Cross-box access** is prevented at database level

### Authentication

- JWT tokens stored in httpOnly cookies
- Tokens expire after configurable time
- Refresh tokens for session persistence
- Email verification on signup

## State Management

Using Angular Signals for reactive state:

```typescript
// Component state
isLoading = signal(false);
classes = signal<Class[]>([]);
selectedDate = signal(new Date());

// Computed values
filteredClasses = computed(() => {
  return this.classes().filter(c => 
    c.date === formatDate(this.selectedDate())
  );
});

// Effects
effect(() => {
  console.log('Classes updated:', this.classes().length);
});
```

## Routing Architecture

```
/                           → Landing/Home
/auth
  /login                    → Login page
  /register                 → Register page
  /forgot-password          → Password reset

/dashboard                  → Main dashboard (protected)

/classes                    → Classes management
  /                         → List all classes
  /:id                      → Class details
  /create                   → Create class (owner only)
  /edit/:id                 → Edit class (owner only)

/bookings                   → My bookings (athlete)
  /                         → List my bookings
  /:id                      → Booking details

/wods                       → WOD types management (owner)
  /                         → List WOD types
  /create                   → Create WOD type
  /edit/:id                 → Edit WOD type

/profile                    → User profile
  /settings                 → Profile settings

/box                        → Box management (owner)
  /settings                 → Box settings
  /members                  → Box members list
  /stats                    → Box statistics
```

## Component Architecture

### Atomic Design Inspired

```
Atoms (Basic components)
  → Button, Input, Badge, Avatar, Icon

Molecules (Composite components)
  → Card, Form Field, Search Bar, Date Picker

Organisms (Feature components)
  → Class Card, Booking List, WOD Type Selector

Templates (Page layouts)
  → Main Layout, Auth Layout, Dashboard Layout

Pages (Complete views)
  → Login Page, Classes Page, Dashboard Page
```

## Performance Considerations

1. **Lazy Loading**: Features loaded on-demand
2. **Virtual Scrolling**: For long lists (future)
3. **Caching**: Service layer caching for repeated queries
4. **Optimistic UI**: Update UI before server confirmation
5. **Pagination**: Limit data fetched per request

## Scalability Considerations

1. **Database Indexes**: Proper indexing on foreign keys and dates
2. **Query Optimization**: Use views for complex queries
3. **CDN**: Static assets served via CDN
4. **Image Optimization**: Compressed avatars and logos
5. **Connection Pooling**: Supabase handles this automatically

## Future Enhancements

1. **Mobile App**: React Native or Flutter
2. **Analytics**: Track user behavior and box performance
3. **Payments**: Stripe integration for memberships
4. **Notifications**: Email and push notifications
5. **Social Features**: Member profiles, leaderboards
6. **Advanced Scheduling**: Recurring classes, templates
7. **Trainer Features**: Trainer-specific dashboard
8. **Waitlist Management**: Automated waitlist system

## Migration Strategy (If needed)

### From Supabase to Custom Backend

**Phase 1**: Keep Supabase, add custom endpoints
**Phase 2**: Migrate auth to custom solution
**Phase 3**: Migrate database queries
**Phase 4**: Migrate storage
**Phase 5**: Deprecate Supabase

**Estimated effort**: 2-3 months with 1 developer

Service abstraction makes this feasible without touching UI components.

