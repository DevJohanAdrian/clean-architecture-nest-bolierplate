export const SYSTEM_ROLES = {
  ADMIN: { id: 1, code: 'C01', name: 'admin' },
  USER: { id: 2, code: 'C02', name: 'user' },
  MANAGER: { id: 3, code: 'C03', name: 'manager' },
} as const;

export type SystemRoleKey = keyof typeof SYSTEM_ROLES;
