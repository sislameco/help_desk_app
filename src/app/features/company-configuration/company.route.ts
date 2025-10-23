import { Routes } from '@angular/router';
import { CompanyList } from './components/company-list/company-list';
import { CompanySetting } from './components/company-settings/company-setting';
import { CompanyDetail } from './components/company-detail/company-detail';
import { NotificationConfig } from './components/notification-config/notification-config';
import { EmailConfig } from './components/email-config/email-config';
import { TicketTypeComponent } from './components/ticket-type-component/ticket-type-component';
import { SlaConfiguration } from './components/sla-configuration/sla-configuration';
import { DepartmentSetting } from './components/department-setting/department-setting';
import { UserSetting } from './components/user-setting/user-setting';
import { CustomDefineDataSourceComponent } from './components/custom-define-data-source/custom-define-data-source';

export const CompanyRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },

  // 👉 Company List Page
  {
    path: 'list',
    component: CompanyList,
  },

  // 👉 Company Settings Page with child routes for each tab
  {
    path: ':id',
    component: CompanySetting,
    children: [
      { path: '', redirectTo: 'company-detail', pathMatch: 'full' },
      { path: 'company-detail', component: CompanyDetail },
      { path: 'notifications', component: NotificationConfig },
      { path: 'email-settings', component: EmailConfig },
      { path: 'ticket-types', component: TicketTypeComponent },
      { path: 'sla-settings', component: SlaConfiguration },
      { path: 'departments', component: DepartmentSetting },
      { path: 'users', component: UserSetting },
      { path: 'custom-fields', component: CustomDefineDataSourceComponent },
    ],
  },

  // 👉 Fallback
  { path: '**', redirectTo: 'list' },
];
