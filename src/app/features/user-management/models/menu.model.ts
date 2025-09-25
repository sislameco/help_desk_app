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
}

export interface MenuAccess {
  menu: string;
  menuId: number;
  parentId?: number | null;
  actions: MenuAction[];
  childs: MenuAccess[];
}

// ManuActionDto equivalent
export interface ManuAction {
  id: number;
  httpVerb: string;
}

// MenuResourceDto equivalent
export interface MenuResource {
  actions: ManuAction[];
  menus: MenuAccess[]; // assuming you already have a MenuAccess interface
}
