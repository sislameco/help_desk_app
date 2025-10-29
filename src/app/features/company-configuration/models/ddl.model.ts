import { EnumDataType } from './company.model';
import { EnumPriority, EnumQMSType } from './sla.model';

export interface CustomerOutputDto {
  id: number;
  email: string;
  phone: string;
  fullName: string;
}

export interface ProjectOutputDto {
  id: number;
  referenceNumber: string;
  projectAddress: string;
}

export interface DropdownOutputDto {
  id: number;
  name: string;
}

export interface FieldOutputDto {
  id: number;
  fkTicketTypeId: number;
  displayName: string;
  dataType: EnumDataType;
  ddlValue: string[];
  value: string;
  isRequired: boolean;
  description: string;
  isMultiSelect: boolean;
}

export interface TicketTypeDDL {
  id: number;
  title: string;
  qmsType: EnumQMSType;
  priority: EnumPriority;
}
