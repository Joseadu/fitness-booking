# 🏋️ Fitness Booking

Multi-tenant SaaS platform for CrossFit boxes and functional gyms to manage classes, custom WOD types, and member bookings.

## 🎯 Key Features

- 🏢 **Multi-tenant**: Each box operates independently
- 🔐 **Role-based Access**: Business owners, athletes, trainers
- 💪 **Custom WOD Types**: Each box defines their own workout types
- 📅 **Flexible Scheduling**: Schedule classes with specific dates and times
- 📊 **Booking Management**: Athletes can book and manage reservations
- 🎨 **Modern Design System**: Custom SASS-based design system
- 📱 **Responsive**: Mobile-first approach

## 👥 User Roles

### Business Owner
- Create and manage their box
- Define custom WOD types (e.g., "Endurance", "Halterofilia", "CrossTraining")
- Schedule classes with specific dates, times, and capacity
- View and manage all bookings
- Configure box settings

### Athlete
- Join a box
- Browse available classes
- Book classes for specific WOD types, dates, and times
- Manage their bookings
- View booking history

## 🛠️ Tech Stack

### Frontend
- **Angular 20** (Standalone Components)
- **TypeScript 5.9**
- **SASS** (Custom design system)
- **RxJS** (Reactive programming)
- **Angular Signals** (State management)

### Backend
- **Supabase** (Backend as a Service)
- **PostgreSQL** (Database)
- **JWT Authentication**
- **Row Level Security** (Data isolation)

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                 # Servicios singleton, guards, interceptors
│   │   ├── services/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── models/
│   │
│   ├── shared/               # Componentes, pipes, directives reutilizables
│   │   ├── components/
│   │   ├── pipes/
│   │   ├── directives/
│   │   └── utils/
│   │
│   ├── features/             # Módulos de funcionalidad
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── classes/
│   │   ├── bookings/
│   │   └── ...
│   │
│   └── layout/               # Layouts de la aplicación
│
└── styles/                   # Sistema de diseño SASS
    ├── abstracts/            # Variables, mixins, functions
    ├── base/                 # Reset, tipografía, base
    ├── themes/               # Temas
    └── utilities/            # Clases utility (tipo Bootstrap)
```

## 🎨 Sistema de Diseño

El proyecto utiliza un sistema de diseño propio basado en clases utility similar a Bootstrap/Tailwind. Ver documentación completa en [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

### Ejemplos rápidos

```html
<!-- Espaciado -->
<div class="p-4 mt-8 mx-auto">...</div>

<!-- Flexbox -->
<div class="d-flex justify-between align-center gap-4">...</div>

<!-- Grid -->
<div class="d-grid grid-cols-3 gap-6">...</div>

<!-- Colores -->
<div class="bg-primary text-white rounded-lg shadow-md">...</div>
```

## 🚦 Comenzar

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Build

```bash
npm run build
```

### Tests

```bash
npm test
```

## 📖 Documentation

- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Current status and roadmap
- **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** - Design system documentation
- **[CONVENTIONS.md](./CONVENTIONS.md)** - Coding conventions
- **[docs/DATABASE.md](./docs/DATABASE.md)** - Database schema
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System architecture

## 📝 Roadmap

### ✅ Phase 1: Foundation (Complete)
- [x] SASS design system with utility classes
- [x] Modular folder structure
- [x] Button component with 7 variants
- [x] Database schema design
- [x] TypeScript interfaces
- [x] Complete documentation

### 🚧 Phase 2: Backend Setup (In Progress)
- [ ] Supabase project setup
- [ ] Database migrations
- [ ] Authentication configuration
- [ ] Service layer with abstraction

### 📋 Phase 3: Authentication
- [ ] Login/Register pages
- [ ] Auth service
- [ ] Auth guard
- [ ] Session management

### 📋 Phase 4: Core Features
- [ ] Box creation and setup
- [ ] WOD types management
- [ ] Class scheduling
- [ ] Booking system
- [ ] Dashboards (owner & athlete)

### 📋 Phase 5: Enhancement
- [ ] Additional UI components
- [ ] Member management
- [ ] Notifications
- [ ] Analytics

## 📄 Licencia

MIT

## 👥 Autor

Jose Diaz
