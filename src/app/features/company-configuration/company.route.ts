import { Routes } from '@angular/router';
import { CompanyList } from './components/company-list/company-list';
import { CompanySetting } from './components/company-settings/company-setting';

export const CompanyRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  {
    path: '',
    component: CompanyList,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: CompanyList,
      },
      {
        path: 'company-configuration/:id',
        component: CompanySetting,
      },
      { path: '**', redirectTo: 'list' },
    ],
  },
  { path: '**', redirectTo: 'list' },
];
