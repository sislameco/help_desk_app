import { Routes } from '@angular/router';
import { Pages } from './pages';
import { Home } from './home/home';

export const PagesRoute: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: Pages,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'home', component: Home },
      {
        path: 'user-management',
        loadChildren: () =>
          import('./user-management/user-management.route').then((m) => m.UserManagementRoute),
      },
      {
        path: 'tickets',
        loadChildren: () => import('./workflow/ticket.route').then((m) => m.TicketRoutes),
      },
      {
        path: 'company-configuration',
        loadChildren: () =>
          import('./company-configuration/company.route').then((m) => m.CompanyRoutes),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
