// ============================================
// MODELOS E INTERFACES GLOBALES
// ============================================

// User models
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  TRAINER = 'trainer'
}

// Aquí se agregarán más modelos según se necesiten

