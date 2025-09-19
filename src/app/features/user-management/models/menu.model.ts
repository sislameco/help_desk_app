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
  actions: MenuAction[]; // can be [] if none
  children: MenuItem[]; // recursive structure
}
