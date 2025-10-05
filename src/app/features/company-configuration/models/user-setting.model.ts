import { EnumRStatus, PagedInputDto } from '../../user-management/models/user-list-model';

// ✅ Base pagination input (similar to PagedInputDto)

// ✅ UserPaginationInputDto
export interface UserPaginationInputDto extends PagedInputDto {
  departmentId?: number;
  roleId?: number;
}

// ✅ UserSetupOutputDto
export interface UserSetupOutputDto {
  id: number;
  fullName: string;
  email: string;
  userName: string;
  phoneNumber: string;
  emailAddress: string; // fixed from int → string (based on naming)
  departmentName: string;
  roleName: string;
  departmentId: number;
  roleId: number;
  status: EnumRStatus;
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
