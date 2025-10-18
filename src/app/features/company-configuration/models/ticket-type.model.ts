export interface TicketTypeCommonDto {
  title: string;
  description: string;
  fkAssignedUserId?: number;
  priority: number; // EnumPriority from backend
  isEnabled: boolean;
  fkDepartmentIds: number[];
  fkCompanyId: number;
}

export type TicketTypeInputDto = TicketTypeCommonDto;
export interface TicketTypeOutputDto extends TicketTypeCommonDto {
  id: number;
  departmentNames: string[];
}
