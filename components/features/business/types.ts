export type NavIconKey =
  | 'dashboard'
  | 'workflows'
  | 'analytics'
  | 'audit'
  | 'settings'
  | 'help';

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  icon?: NavIconKey;
};
