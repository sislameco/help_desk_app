import { MenuAccess } from '../../user-management/models/menu.model';
import { RoleMenuAction } from '../../user-management/models/role.model';
import { EnumRStatus } from '../../user-management/models/user-list-model';

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
  moduls: string[];
}

export interface DepartmentUpdateDto {
  id: number;
  description: string;
  managerId: number;
  status: EnumRStatus;
  menus: DepartmentMenu[];
}
export interface DepartmentSetupOutputDto {
  id: number;
  name: string;
  description: string;
  managerId: number;
  status: EnumRStatus;
  menus: MenuAccess[];
}
export interface DepartmentMenu extends RoleMenuAction {
  isAllowed: boolean;
  fkMenuActionMapId: number;
}
