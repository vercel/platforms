export type Role = 'owner' | 'admin' | 'coach' | 'viewer'

const RANK: Record<Role, number> = { owner: 4, admin: 3, coach: 2, viewer: 1 }

function atLeast(role: Role, min: Role): boolean {
  return RANK[role] >= RANK[min]
}

// Permission checks — use these in server actions and to conditionally render UI
export const can = {
  manageSettings:   (role: Role) => atLeast(role, 'admin'),
  manageCoaches:    (role: Role) => atLeast(role, 'admin'),
  createGameDay:    (role: Role) => atLeast(role, 'admin'),
  editGame:         (role: Role, canEditGames?: boolean) => atLeast(role, 'admin') || (role === 'coach' && !!canEditGames),
  manageRosters:    (role: Role) => atLeast(role, 'coach'),
  managePlayers:    (role: Role) => atLeast(role, 'coach'),
  manageMembers:    (role: Role) => atLeast(role, 'admin'),
  viewData:         (_role: Role) => true,
}

export const ROLE_LABELS: Record<Role, string> = {
  owner:  'Owner',
  admin:  'Admin',
  coach:  'Coach',
  viewer: 'Viewer',
}

export function roleLabel(role: Role): string {
  return ROLE_LABELS[role] ?? role
}

// Roles available for assignment in the Members UI
export const ASSIGNABLE_ROLES: Role[] = ['admin', 'coach', 'viewer']
