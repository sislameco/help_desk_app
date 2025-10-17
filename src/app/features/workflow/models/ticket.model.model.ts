export interface TicketListViewDto {
  id: number;
  ticketNumber: string;
  subject: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  createdDate: Date;
  lastUpdate: Date;
}

export interface AddTicketInputDto {
  // Screen 1
  fkCompanyId: number;
  subject: number; // if subject is text input, change to string
  description: string;

  // Screen 2
  isCustomer: boolean;
  fkCustomerId?: number | null; // dropdown
  fkProjectId?: number | null; // dropdown

  // Screen 3
  fkTicketTypeId: number; // dropdown
  subFrom: SubFromInputDto[]; // from API
  fkRelocationId: number; // dropdown
  fkRootCauseId: number; // dropdown

  // Screen 4
  fkAssignUser: number; // dropdown
  fkDepartmentId: number[]; // multi-select dropdown
  files: number[]; // uploaded file IDs
}

export interface SubFromInputDto {
  id: number;
  value: string;
}
