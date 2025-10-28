import {
  EnumRStatus,
  PagedInputDto,
  UserProfileDto,
} from '../../user-management/models/user-list-model';

// ✅ Base pagination input (similar to PagedInputDto)

// ✅ UserPaginationInputDto
export interface UserPaginationInputDto extends PagedInputDto {
  departmentId?: number;
  roleId?: number;
}
export interface UserSettingPaginationInputDto {
  departmentIds?: number[];
  // moduleIds?: number[];
  search?: string;
  status?: number;
  page?: number;
  pageSize?: number;
  sortColumn?: string;
  sortBy?: number;
}

// ✅ UserSetupOutputDto
export interface UserSetupOutputDto extends UserProfileDto {
  id: number;
  fullName: string;
  userName: string;
  phoneNumber: string;
  emailAddress: string; // fixed from int → string (based on naming)
  departmentName: string;
  roleName: string;
  departmentId: number;
  roleId: number;
  status: EnumRStatus;
  isAdmin: boolean;
}

// ✅ UserSetupInputDto
export interface UserSetupInputDto {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  departmentId: number;
  roleId: number;
  status: EnumRStatus;
}

export interface UserFilterParams
  extends Record<string, string | number | number[] | boolean | undefined> {
  page: number;
  pageSize: number;
  departmentIds?: number[];
  // moduleIds?: number[];
  // status?: number;
  searchText?: string;
  sortColumn?: string;
  sortBy?: number;
}
