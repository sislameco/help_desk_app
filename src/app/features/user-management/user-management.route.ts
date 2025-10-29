import { Routes } from '@angular/router';
import { UserManagement } from './user-management';
import { UserRole } from './components/user-role/user-role';
import { UserList } from './components/user-list/user-list';
import { InviteUser } from './components/user-list/invite-user/invite-user';
import { UserListTable } from './components/user-list/user-list-table/user-list-table';

export const UserManagementRoute: Routes = [
  { path: '', redirectTo: 'user-management', pathMatch: 'full' },
  {
    path: '',
    component: UserManagement,
    children: [
      { path: '', redirectTo: 'roles', pathMatch: 'full' },
      {
        path: 'roles',
        component: UserRole,
        data: {
          showBackButton: true,
          // title: 'Product Categories',
          // breadcrumb: ['Procurement ', 'Product Details', 'Product Categories'],
          // backTo: '/pages/procurement/product-details/products',
          // actions: { search: false, viewArchive: true, export: false, more: false },
        },
      },
      {
        path: 'users',
        component: UserList,
        children: [
          {
            path: 'list',
            component: UserListTable,
          },
          {
            path: 'invite-user',
            component: InviteUser,
          },
        ],
      },
      { path: '**', redirectTo: 'roles' },
    ],
  },

  { path: '**', redirectTo: 'user-management' },
];
