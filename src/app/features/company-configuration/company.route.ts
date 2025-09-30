import { Routes } from '@angular/router';
import { CompanyList } from './components/company-list/company-list';
import { CompanySetting } from './components/company-settings/company-setting';

export const CompanyRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },

  // 👉 Company List Page
  {
    path: 'list',
    component: CompanyList,
  },

  // 👉 Company Settings Page
  {
    path: ':id',
    component: CompanySetting,
  },

  // 👉 Fallback
  { path: '**', redirectTo: 'list' },
];
