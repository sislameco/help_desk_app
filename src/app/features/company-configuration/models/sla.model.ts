import { EnumRStatus } from "../../user-management/models/user-list-model";

export enum EnumUnit {
  Minutes = 1,
  Hours = 2,
  Days = 3,
  Weeks = 4,
  Months = 5,
}

export enum EnumPriority {
  Highest = 1,
  High = 2,
  Medium = 3,
  Low = 4,
}

export enum EnumQMSType {
  Ticket = 1,
  CAPA = 2,
  Goals = 3,
  Complaints = 4,
}
export interface SLAInputDto {
  type: EnumQMSType;
  priority: EnumPriority;
  fkCompanyId: number;
  unit: EnumUnit;
  responseTime: number;
  resolutionTime: number;
  escalationTime: number;
  status: EnumRStatus;
}

export interface SLAOutputDto extends SLAInputDto {
  id: number;
}

// You may need to define QMSType, TicketPriority, EnumUnit elsewhere or import them.
