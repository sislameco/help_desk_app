import { Type } from '@angular/core';
import { DepartmentSetting } from '../components/department-setting/department-setting';
import { CompanyDetail } from '../components/company-detail/company-detail';

export const tabs: TabConfig[] = [
  { label: 'Company Detail', component: CompanyDetail },
  { label: 'Notifications', component: DepartmentSetting },
  { label: 'Email Settings', component: DepartmentSetting },
  { label: 'SLA Settings', component: DepartmentSetting },
  { label: 'Departments', component: DepartmentSetting },
  { label: 'Users', component: DepartmentSetting },
  { label: 'Custom Fields', component: DepartmentSetting },
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
