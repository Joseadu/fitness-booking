# 📐 Convenciones del Proyecto

## Nomenclatura

### Componentes

- **Prefijo**: `fb-` (Fitness Booking)
- **Clase TypeScript**: PascalCase sin prefijo (ej: `Button`, `CardList`)
- **Selector**: kebab-case con prefijo (ej: `fb-button`, `fb-card-list`)
- **Archivos**: kebab-case sin prefijo

```
✅ Correcto:
- Clase: Button
- Selector: fb-button
- Archivos: button.ts, button.html, button.scss

❌ Incorrecto:
- Clase: FbButton
- Selector: app-button
- Archivos: FbButton.ts
```

### Servicios

- **Sufijo**: `Service`
- **Ubicación**: `core/services/`
- **Ejemplo**: `AuthService`, `BookingService`

### Modelos

- **Ubicación**: `core/models/`
- **Tipos**: interfaces (mayormente) y enums cuando sea necesario
- **Ejemplo**: `User`, `Class`, `Booking`

### Utilidades

- **Ubicación**: `shared/utils/`
- **Formato**: funciones exportadas con camelCase
- **Ejemplo**: `formatDate()`, `generateId()`

## Estructura de Archivos

### Componentes

```
component-name/
├── component-name.ts        # Lógica
├── component-name.html      # Template
├── component-name.scss      # Estilos
└── README.md               # Documentación (opcional, para componentes complejos)
```

### Features

```
feature-name/
├── components/             # Componentes específicos del feature
├── services/              # Servicios específicos del feature
├── models/                # Modelos específicos del feature
├── feature-name.routes.ts # Rutas del feature
└── index.ts               # Barrel export
```

## Estilos (SASS)

### BEM para componentes

```scss
.fb-button {                    // Bloque
  &__content {                  // Elemento
    // ...
  }
  
  &--primary {                  // Modificador
    // ...
  }
  
  &--loading {                  // Estado
    // ...
  }
}
```

### Clases Utility

- Usar clases utility del sistema para espaciado, colores, etc.
- Solo crear estilos scoped cuando sea necesario

```html
<!-- ✅ Preferido -->
<div class="d-flex justify-between align-center p-4 bg-white rounded-lg shadow">

<!-- ❌ Evitar -->
<div class="custom-container">
<!-- y luego definir todos los estilos en SCSS -->
```

### Orden de importación en SCSS

```scss
// 1. Variables y abstracts del sistema
@import '../../../styles/abstracts/variables';
@import '../../../styles/abstracts/mixins';

// 2. Estilos del componente
.fb-component {
  // ...
}
```

## TypeScript

### Signals (Angular)

Usar el nuevo API de signals para inputs y estado:

```typescript
// ✅ Inputs con signals
variant = input<ButtonVariant>('primary');
size = input<ButtonSize>('md');

// ✅ Computed properties
buttonClasses = computed(() => {
  return `fb-button fb-button--${this.variant()}`;
});

// ✅ Estado interno
isOpen = signal(false);
```

### Tipos e Interfaces

```typescript
// ✅ Type para uniones literales
export type ButtonVariant = 'primary' | 'secondary' | 'success';

// ✅ Interface para objetos
export interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ Enum solo cuando tiene sentido semántico
export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member'
}
```

### Imports

```typescript
// ✅ Orden de imports:
// 1. Angular core
import { Component, input, computed } from '@angular/core';

// 2. Angular common/forms/router
import { CommonModule } from '@angular/common';

// 3. RxJS
import { Observable } from 'rxjs';

// 4. Servicios propios
import { AuthService } from '@app/core/services';

// 5. Modelos propios
import { User } from '@app/core/models';

// 6. Componentes propios
import { Button } from '@app/shared/components';
```

### Path aliases

Usar path aliases para imports limpios:

```typescript
// ✅ Con alias
import { Button } from '@app/shared/components';

// ❌ Sin alias
import { Button } from '../../../shared/components/button/button';
```

## Componentes Angular

### Standalone Components

Todos los componentes son standalone:

```typescript
@Component({
  selector: 'fb-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {}
```

### Template syntax

```html
<!-- ✅ Usar nuevo control flow -->
@if (condition) {
  <div>Content</div>
}

@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}

<!-- ❌ No usar viejo *ngIf, *ngFor -->
```

## Git Commits

### Formato

```
tipo(scope): mensaje

Ejemplos:
feat(button): agregar variante outline
fix(auth): corregir validación de email
style(button): ajustar padding
docs(readme): actualizar instrucciones de instalación
refactor(services): extraer lógica común
```

### Tipos

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `style`: Cambios de estilo/formato
- `refactor`: Refactorización de código
- `docs`: Documentación
- `test`: Tests
- `chore`: Tareas de mantenimiento

## Testing (Futuro)

```typescript
// Nomenclatura de tests
describe('Button', () => {
  it('should render with primary variant by default', () => {
    // ...
  });
  
  it('should apply disabled state correctly', () => {
    // ...
  });
});
```

## Accesibilidad

- Todos los botones interactivos deben ser `<button>` o tener `role="button"`
- Focus visible con `focus-ring` mixin
- Labels apropiados para screen readers
- Contraste de colores WCAG AA mínimo

## Performance

- Usar `track` en `@for` loops
- Lazy loading para features
- Signals para reactividad eficiente
- OnPush change detection cuando sea posible

---

**Importante**: Estas convenciones son vivas y pueden evolucionar. Documenta cualquier cambio importante.

