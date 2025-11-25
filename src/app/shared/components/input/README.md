# Input Component

Componente de input reutilizable compatible con Angular Forms (Reactive y Template-driven).

## Características

- ✅ Compatible con `ngModel` y `FormControl`
- ✅ Soporte para diferentes tipos (text, email, password, number, tel, url)
- ✅ Toggle de visibilidad en password
- ✅ Soporte para iconos
- ✅ Mensajes de error
- ✅ Estados (focus, error, disabled)
- ✅ 3 tamaños (sm, md, lg)
- ✅ Accesibilidad completa

## Uso Básico

### Template-driven Forms

```typescript
import { Input } from '@shared/components';

@Component({
  imports: [Input, FormsModule]
})
```

```html
<fb-input 
  type="email" 
  placeholder="correo@ejemplo.com"
  [(ngModel)]="email">
</fb-input>
```

### Reactive Forms

```typescript
import { Input } from '@shared/components';

@Component({
  imports: [Input, ReactiveFormsModule]
})
export class MyComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
}
```

```html
<form [formGroup]="form">
  <fb-input 
    type="email" 
    placeholder="correo@ejemplo.com"
    formControlName="email"
    [error]="form.get('email')?.errors ? 'Email inválido' : null">
  </fb-input>
</form>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `type` | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url'` | `'text'` | Tipo de input |
| `placeholder` | `string` | `''` | Placeholder |
| `error` | `string \| null` | `null` | Mensaje de error |
| `disabled` | `boolean` | `false` | Si está deshabilitado |
| `required` | `boolean` | `false` | Si es requerido |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño |
| `iconStart` | `string \| null` | `null` | Icono al inicio |
| `iconEnd` | `string \| null` | `null` | Icono al final |
| `inputId` | `string` | auto | ID del input |
| `name` | `string` | `''` | Nombre del input |
| `autocomplete` | `string \| null` | `null` | Autocomplete |

## Ejemplos

### Password con toggle

```html
<fb-input 
  type="password" 
  placeholder="Contraseña"
  [(ngModel)]="password">
</fb-input>
```

### Input con icono

```html
<fb-input 
  type="email" 
  placeholder="Buscar..."
  iconStart="🔍"
  [(ngModel)]="search">
</fb-input>
```

### Input con error

```html
<fb-input 
  type="email" 
  placeholder="correo@ejemplo.com"
  [error]="emailError"
  [(ngModel)]="email">
</fb-input>
```

### Tamaños

```html
<!-- Small -->
<fb-input size="sm" placeholder="Small input" />

<!-- Medium (default) -->
<fb-input size="md" placeholder="Medium input" />

<!-- Large -->
<fb-input size="lg" placeholder="Large input" />
```

### Disabled

```html
<fb-input 
  placeholder="Input deshabilitado" 
  [disabled]="true">
</fb-input>
```

## Accesibilidad

- ✅ Focus visible
- ✅ Labels asociados con `inputId`
- ✅ Mensajes de error descriptivos
- ✅ Toggle de password con aria-label
- ✅ Estados disabled correctos

