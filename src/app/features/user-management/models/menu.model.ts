export interface MenuAction {
  keyEnum: number;
  displayName: string;
}

export interface MenuItem {
  id: number;
  key: string;
  displayName: string;
  route: string;
  sortOrder: number;
  parentId: number | null;
  actions: MenuAction[];
  children: MenuItem[];
}

export interface MenuAction {
  id: number;
  httpVerb: string;
  isPermitted: boolean;
  fkMenuActionMapId: number;
}

export interface MenuAccess {
  menu: string;
  menuId: number;
  parentId?: number | null;
  actions: MenuAction[];
  childs: MenuAccess[];
}

// ManuActionDto equivalent
export interface Action {
  id: number;
  httpVerb: string;
}

// MenuResourceDto equivalent
export interface MenuResource {
  role: { name: ''; description: '' };
  actions: Action[];
  menus: MenuAccess[]; // assuming you already have a MenuAccess interface
}
