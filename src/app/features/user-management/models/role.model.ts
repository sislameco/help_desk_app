export enum RStatusEnum {
  Active = 1,
  Inactive = 2,
  Deleted = 3,
}

export enum RoleTypeEnum {
  System = 0,
  Custom = 1,
}

export interface RoleListItemDto {
  id: number;
  name: string;
  type: RoleTypeEnum;
  status: RStatusEnum;
  description: string;
  isCommissionRole: boolean;
}

export interface RoleFilterParams extends Record<string, string | number | boolean | undefined> {
  page: number;
  pageSize: number;
}

export interface RolePermission {
  name: string;
  collapsed: boolean;
  children?: RolePermission[];
}

export interface RoleUpsertRequest {
  roleId: number | null; // null for insert, number for update
  roleName: string;
  description: string;
  isCommissionRole: boolean;
  commissionItemId: number | null;
  menus: RoleMenuUpsert[];
}

export interface RoleMenuUpsert {
  id?: number; // required for update, omitted for insert
  actions: number[];
  children: RoleMenuUpsert[]; // recursive for nested menus
}
export interface RoleWithUsersDto {
  roleId: number;
  roleName: string;
  type: string;
  description: string;
  users: string;
}

export interface RoleMenuAction {
  isAllowed: boolean;
  fkMenuActionMapId: number;
}

export interface RoleInput {
  name: string;
  description: string;
  fkMenuActionIds: RoleMenuAction[];
}
