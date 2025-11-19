# 🎨 Sistema de Diseño - Fitness Booking

## 📋 Tabla de Contenidos
- [Introducción](#introducción)
- [Estructura](#estructura)
- [Variables](#variables)
- [Utilidades](#utilidades)
- [Mixins](#mixins)
- [Componentes](#componentes)

## Introducción

Este proyecto utiliza un sistema de diseño propio basado en **clases utility** similar a Bootstrap/Tailwind, pero personalizado para las necesidades de Fitness Booking. Todo está construido con **SASS** y es completamente modular y escalable.

## Estructura

```
src/styles/
├── abstracts/          # Variables, mixins, funciones
│   ├── _variables.scss
│   ├── _mixins.scss
│   └── _functions.scss
├── base/               # Estilos base
│   ├── _reset.scss
│   ├── _typography.scss
│   └── _container.scss
├── themes/             # Temas (light/dark)
│   └── _default.scss
└── utilities/          # Clases utility
    ├── _spacing.scss
    ├── _display.scss
    ├── _flex.scss
    ├── _grid.scss
    ├── _colors.scss
    ├── _borders.scss
    ├── _sizing.scss
    └── _shadows.scss
```

## Variables

### 🎨 Colores

```scss
// Principales
$primary: #6366f1      // Indigo
$secondary: #ec4899    // Pink
$success: #10b981      // Green
$warning: #f59e0b      // Amber
$danger: #ef4444       // Red
$info: #3b82f6         // Blue

// Grises
$gray-50 hasta $gray-900
```

### 📏 Espaciado

Sistema basado en **4px** (0.25rem):

```scss
0:  0px
1:  4px
2:  8px
3:  12px
4:  16px
5:  20px
6:  24px
8:  32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
```

### 📱 Breakpoints (Mobile First)

```scss
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

## Utilidades

### Espaciado (Margin & Padding)

Formato: `.{property}{sides}-{size}`

```html
<!-- Margin -->
<div class="m-4">Margin 16px todos los lados</div>
<div class="mt-2">Margin top 8px</div>
<div class="mx-auto">Margin horizontal auto (centrar)</div>

<!-- Padding -->
<div class="p-6">Padding 24px todos los lados</div>
<div class="px-4 py-2">Padding horizontal 16px, vertical 8px</div>

<!-- Gap (flexbox/grid) -->
<div class="d-flex gap-4">Gap 16px</div>
```

### Display & Flexbox

```html
<!-- Display -->
<div class="d-flex">Display flex</div>
<div class="d-grid">Display grid</div>
<div class="d-none d-md-block">Oculto en móvil, visible en md+</div>

<!-- Flexbox -->
<div class="d-flex justify-center align-center">
  Centrado vertical y horizontal
</div>

<div class="d-flex justify-between align-center">
  Space between con align center
</div>

<div class="d-flex flex-column gap-4">
  Columna con gap
</div>
```

### Grid

```html
<!-- Grid básico -->
<div class="d-grid grid-cols-3 gap-4">
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>

<!-- Grid responsive -->
<div class="d-grid grid-cols-1 grid-cols-md-2 grid-cols-lg-4 gap-6">
  <!-- 1 columna en móvil, 2 en tablet, 4 en desktop -->
</div>

<!-- Span -->
<div class="d-grid grid-cols-12 gap-4">
  <div class="col-span-12 col-span-md-6">6 columnas en md+</div>
</div>
```

### Colores

```html
<!-- Texto -->
<p class="text-primary">Texto primario</p>
<p class="text-gray-500">Texto gris</p>
<p class="text-danger">Texto de error</p>

<!-- Fondo -->
<div class="bg-primary text-white">Fondo primario</div>
<div class="bg-gray-100">Fondo gris claro</div>
```

### Bordes

```html
<!-- Border -->
<div class="border">Borde básico</div>
<div class="border border-primary">Borde primario</div>

<!-- Border radius -->
<div class="rounded">Border radius 8px</div>
<div class="rounded-lg">Border radius 12px</div>
<div class="rounded-full">Border radius circular</div>
```

### Sombras

```html
<div class="shadow">Sombra básica</div>
<div class="shadow-md">Sombra media</div>
<div class="shadow-lg">Sombra grande</div>
```

### Sizing

```html
<div class="w-100">Ancho 100%</div>
<div class="h-100">Alto 100%</div>
<div class="vh-100">Alto 100vh (viewport)</div>
```

## Mixins

### Responsive

```scss
.mi-componente {
  width: 100%;
  
  @include respond-to(md) {
    width: 50%;
  }
  
  @include respond-to(lg) {
    width: 33.333%;
  }
}
```

### Flexbox

```scss
.centrado {
  @include flex-center; // display: flex + center
}

.entre {
  @include flex-between; // space-between + align center
}
```

### Truncar texto

```scss
.titulo {
  @include text-truncate; // Truncar en 1 línea
}

.descripcion {
  @include line-clamp(3); // Truncar en 3 líneas
}
```

### Focus ring (accesibilidad)

```scss
button {
  &:focus-visible {
    @include focus-ring($primary);
  }
}
```

## Contenedor

```html
<!-- Contenedor responsive con max-width -->
<div class="container">
  <!-- Contenido -->
</div>

<!-- Contenedor fluido (sin max-width) -->
<div class="container-fluid">
  <!-- Contenido -->
</div>
```

## Ejemplo Completo

```html
<div class="container py-8">
  <div class="d-grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3 gap-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl fw-bold mb-4">Clase de CrossFit</h3>
      <p class="text-gray-600 mb-4">
        Entrenamiento funcional de alta intensidad
      </p>
      <button class="btn btn-primary w-100">
        Reservar
      </button>
    </div>
  </div>
</div>
```

## 🚀 Próximos Pasos

- [ ] Componentes reutilizables (Button, Input, Card, Modal)
- [ ] Sistema de notificaciones
- [ ] Tema oscuro
- [ ] Animaciones
- [ ] Librería de componentes separada

---

**Nota**: Este sistema está diseñado para ser escalable. Se pueden añadir más utilidades según se necesiten durante el desarrollo.

