export interface UserModel {
  name: string;
  email: string;
  phone: string;
  roles: string;
  status: string;
  warehouse: string;
}
export interface Users {
  fullName: string;
  email: string;
  phone: string;
  roles: string;
  status: EnumRStatus;
  departments: string;
}

// Matches C# PagedInputDto
export interface PagedInputDto {
  /** Optional search text for filtering (applies to Name, Code, etc.) */
  searchText?: string;

  /** Status filter (e.g., Active/Inactive, Approved/Pending).
   * Should match your EnumRStatus in backend. */
  status: EnumRStatus;

  /** Current page number (1-based). */
  pageNo: number;

  /** Number of items per page. */
  itemsPerPage: number;
}

// Mirror your backend EnumRStatus
export enum EnumRStatus {
  Active = 1,
  Inactive = 2,
  Pending = 3,
}
export interface UserFilterDto extends PagedInputDto {
  companyId: number;
  roleIds: number[];
  departmentIds: number[];
}
