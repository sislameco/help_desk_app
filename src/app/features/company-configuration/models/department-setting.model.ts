export interface DepartmentSettingInputDto {
  userIds?: number[];
  searchText?: string;
  status?: number;
  pageNo?: number;
  itemsPerPage?: number;
}

export interface DepartmentSettingOutputDto {
  id: number;
  name: string;
  description: string;
  managerName: string;
  managerEmail: string;
  status: number;
  totalUsers: number;
}
