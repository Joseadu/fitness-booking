# 🏋️ Fitness Booking

Sistema de gestión y reservas para boxes de CrossFit y gimnasios funcionales, inspirado en WODBuster.

## 🚀 Características

- 📅 Sistema de reservas de clases
- 👥 Gestión de miembros y usuarios
- 💪 Programación de WODs (Workout of the Day)
- 📊 Panel de administración
- 🎨 Sistema de diseño propio y modular
- 📱 Responsive (preparado para versión móvil futura)

## 🛠️ Tecnologías

- **Angular 20** (Standalone Components)
- **TypeScript**
- **SASS** (Sistema de diseño propio)
- **RxJS**

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

## 📝 Roadmap

### Fase 1: Fundamentos ✅
- [x] Sistema de diseño SASS
- [x] Estructura de carpetas modular
- [ ] Componentes base reutilizables
- [ ] Layout principal
- [ ] Routing básico

### Fase 2: Autenticación
- [ ] Login/Registro
- [ ] Guards y gestión de sesión
- [ ] Perfil de usuario

### Fase 3: Features principales
- [ ] Dashboard
- [ ] Sistema de reservas de clases
- [ ] Gestión de horarios
- [ ] Calendario de clases

### Fase 4: Administración
- [ ] Panel de administración
- [ ] Gestión de miembros
- [ ] Estadísticas y reportes

## 📄 Licencia

MIT

## 👥 Autor

Jose Diaz
