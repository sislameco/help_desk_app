import { MenuItem } from './sidebar-data-type';

export const MENUS: MenuItem[] = [
  {
    label: 'Home',
    icon: 'svg-menu-home',
    link: '/',
  },
  {
    label: 'User Management',
    icon: 'svg-menu-home',
    isOpen: false,
    children: [
      { label: 'User', link: '/pages/user-management/users/list' },
      { label: 'Roles', link: '/pages/user-management/roles' },
    ],
  },
  {
    label: 'Settings',
    icon: 'svg-menu-settings',
    isOpen: false,
    children: [
      { label: 'Profile', link: '#' },
      { label: 'Users', link: '#' },
    ],
  },
  {
    label: 'Quality Management',
    icon: 'svg-menu-quality',
    isOpen: false,
    children: [{ label: 'Audit', link: '#' }],
  },
];
