# Button Component

Componente de botón reutilizable con múltiples variantes, tamaños y estados.

## Uso Básico

```typescript
import { Button } from '@app/shared/components';

@Component({
  imports: [Button],
  // ...
})
```

```html
<fb-button>Click me</fb-button>
```

## Props (Inputs)

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'outline' \| 'ghost'` | `'primary'` | Variante visual del botón |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del botón |
| `disabled` | `boolean` | `false` | Si el botón está deshabilitado |
| `fullWidth` | `boolean` | `false` | Si el botón ocupa el 100% del ancho |
| `loading` | `boolean` | `false` | Muestra un spinner de carga |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo HTML del botón |

## Ejemplos

### Variantes

```html
<fb-button variant="primary">Primary</fb-button>
<fb-button variant="secondary">Secondary</fb-button>
<fb-button variant="success">Success</fb-button>
<fb-button variant="danger">Danger</fb-button>
<fb-button variant="warning">Warning</fb-button>
<fb-button variant="outline">Outline</fb-button>
<fb-button variant="ghost">Ghost</fb-button>
```

### Tamaños

```html
<fb-button size="sm">Pequeño</fb-button>
<fb-button size="md">Mediano</fb-button>
<fb-button size="lg">Grande</fb-button>
```

### Estados

```html
<!-- Deshabilitado -->
<fb-button [disabled]="true">Deshabilitado</fb-button>

<!-- Cargando -->
<fb-button [loading]="isLoading">Guardar</fb-button>

<!-- Ancho completo -->
<fb-button [fullWidth]="true">Ancho Completo</fb-button>
```

### En formularios

```html
<form (submit)="onSubmit()">
  <fb-button type="submit" [loading]="isSubmitting">
    Enviar
  </fb-button>
</form>
```

### Con iconos (content projection)

```html
<fb-button variant="primary">
  <svg><!-- icono --></svg>
  Guardar
</fb-button>
```

## Accesibilidad

- ✅ Soporte completo de teclado
- ✅ Focus visible con ring de accesibilidad
- ✅ Estados disabled correctamente manejados
- ✅ Cursor apropiado según el estado

## Estilos personalizados

El componente usa BEM para sus clases CSS:

```scss
.fb-button { /* Base */ }
.fb-button--primary { /* Modificador de variante */ }
.fb-button--sm { /* Modificador de tamaño */ }
.fb-button--full-width { /* Modificador de ancho */ }
.fb-button__spinner { /* Elemento: spinner */ }
.fb-button__content { /* Elemento: contenido */ }
```

## Convención de nomenclatura

- Prefijo: `fb-` (Fitness Booking)
- Selector: `<fb-button>`
- Clase base: `.fb-button`

Este patrón se seguirá para todos los componentes del sistema.

