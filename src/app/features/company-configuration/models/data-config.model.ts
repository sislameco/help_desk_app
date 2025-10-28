import { Type } from '@angular/core';
import { DepartmentSetting } from '../components/department-setting/department-setting';
import { CompanyDetail } from '../components/company-detail/company-detail';
import { NotificationConfig } from '../components/notification-config/notification-config';
import { EmailConfig } from '../components/email-config/email-config';
import { SlaConfiguration } from '../components/sla-configuration/sla-configuration';
import { UserSetting } from '../components/user-setting/user-setting';
import { CustomDefineDataSourceComponent } from '../components/custom-define-data-source/custom-define-data-source';
import { EnumDataType } from './company.model';
import { TicketTypeComponent } from '../components/ticket-type-component/ticket-type-component';

export const tabs: TabConfig[] = [
  { label: 'Company Detail', route: 'company-detail', component: CompanyDetail },
  { label: 'Notifications', route: 'notifications', component: NotificationConfig },
  { label: 'Email Settings', route: 'email-settings', component: EmailConfig },
  { label: 'Ticket Types', route: 'ticket-types', component: TicketTypeComponent },
  { label: 'SLA Settings', route: 'sla-settings', component: SlaConfiguration },
  { label: 'Departments', route: 'departments', component: DepartmentSetting },
  { label: 'Users', route: 'users', component: UserSetting },
  { label: 'Custom Fields', route: 'custom-fields', component: CustomDefineDataSourceComponent },
];
export interface TabConfig {
  label: string;
  route: string;
  component: Type<unknown>;
}
// ✅ Match your C# DTO
export interface CustomFieldDto {
  id?: number;
  fkTicketTypeId: number;
  displayName: string;
  dataType: EnumDataType;
  dDLValue: string[];
  isRequired: boolean;
  description: string;
  isMultiSelect?: boolean;
}
export interface CustomFieldOutputDto {
  id?: number;
  fkTicketTypeId: number;
  displayName: string;
  dataType: EnumDataType;
  dDLValue: string[];
  isRequired: boolean;
  description: string;
  displayOrder: number;
  isMultiSelect?: boolean;
}

export interface TicketTypeDropdownDto {
  id: number;
  name: string;
  fields: CustomFieldOutputDto[];
}
