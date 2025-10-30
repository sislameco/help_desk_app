import { RStatusEnum } from '@shared/enums/r-status.enum';
import { EnumSortBy } from '@shared/enums/sort-by.enum';

export interface TicketListViewDto {
  id: number;
  ticketNumber: string;
  subject: string;
  title: string;
  description: string;
  status: EnumTicketStatus;
  priority: EnumPriority;
  assignee: string;
  reporter: string;
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
  subForm: SubFromInputDto[]; // from API
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

export interface TicketCompanyViewDto {
  id: number;
  companyName: string;
}

export interface ListTicketOutputDto {
  id: number;
  ticketNumber: string;
  subject: string;
  description: string;
}

export interface TicketBasicDetailOutputDto {
  id: number;
  ticketNumber: string;
  subject: string;
  description: string;
  company: TicketCompanyViewDto;
  linkingItems: ListTicketOutputDto[];
}

export interface TicketSpecificationOutputDto {
  rootCauseId?: number;
  resolutionId?: number;
  assigneeId?: number;
  departmentIds: number[];
}

export interface TicketFileDto {
  id: number;
  fileName: string;
  filePath: string;
  addedBy: string;
  addedOn: string;
}

export interface TicketLinkingItemOutputDto {
  id: number;
  ticketNumber: string;
  subject: string;
  url: string;
}

export interface TicketCommentOutputDto {
  id: number;
  fkUserId: number;
  commentText: string;
  commentedOn: Date;
  commentedBy: string;
}

export interface TicketFieldOutputDto {
  id: number;
  fkTicketTypeId: number;
  fkCustomeFieldId: number;
  value: string;
}

export interface TicketWatcherOutputDto {
  id: number;
  fkUserId: number;
  addedBy: string;
  addedOn: Date;
}

export enum EnumTicketStatus {
  Open = 1,
  InProgress = 2,
  Resolved = 3,
  Closed = 4,
}

export enum EnumPriority {
  Highest = 1,
  High = 2,
  Medium = 3,
  Low = 4,
}

export interface TicketFilterParams
  extends Record<string, string | number | number[] | boolean | undefined> {
  page: number;
  pageSize: number;
  search?: string;
  sort?: string;
  status?: number;
  isDynamic?: boolean;
}
export type TicketListFilterParams = TicketFilterParams & {
  page: number;
  pageSize: number;
  status?: number;
  sortColumn?: string;
  sortBy?: EnumSortBy;
  search?: string;
  ticketTypeIds?: number[];
  ticketStatusIds?: number[];
  // supplierIds?: number[];
  // selectedColumns?: number[];
  minPrice?: number;
  maxPrice?: number;
};

export interface TicketRequest {
  page: number;
  pageSize: number;
  sort?: string;
  search?: string;
  ticketTypeIds?: number[];
  ticketStatusIds?: number[];
  // supplierIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  // selectedColumns?: number[];
  status?: RStatusEnum;
}
