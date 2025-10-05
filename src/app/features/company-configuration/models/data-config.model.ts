import { Type } from '@angular/core';
import { DepartmentSetting } from '../components/department-setting/department-setting';
import { CompanyDetail } from '../components/company-detail/company-detail';
import { NotificationConfig } from '../components/notification-config/notification-config';
import { EmailConfig } from '../components/email-config/email-config';
import { SlaConfiguration } from '../components/sla-configuration/sla-configuration';
import { UserSetting } from '../components/user-setting/user-setting';
import { CustomDefineDataSourceComponent } from '../components/custom-define-data-source/custom-define-data-source';

export const tabs: TabConfig[] = [
  { label: 'Company Detail', component: CompanyDetail },
  { label: 'Notifications', component: NotificationConfig },
  { label: 'Email Settings', component: EmailConfig },
  { label: 'SLA Settings', component: SlaConfiguration },
  { label: 'Departments', component: DepartmentSetting },
  { label: 'Users', component: UserSetting },
  { label: 'Custom Fields', component: CustomDefineDataSourceComponent },
];
export interface TabConfig {
  label: string;
  component: Type<unknown>;
}
// ✅ Match your C# DTO
export interface CustomFieldDto {
  id?: number;
  name: string;
  type: string;
  isRequired: boolean;
  // add any other properties from your backend DTO
}
