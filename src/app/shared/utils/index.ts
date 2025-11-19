// ============================================
// UTILIDADES COMPARTIDAS
// ============================================

/**
 * Formatea una fecha a string
 */
export function formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
  // Implementación básica, se puede mejorar con date-fns si es necesario
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : 'long',
    day: 'numeric'
  });
}

/**
 * Genera un ID único simple
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Aquí se agregarán más utilidades según se necesiten

