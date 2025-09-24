export interface SubMenuu {
  menuName: string;
  icon: string;
  route?: string;
  children?: SubMenuu[];
  isOpen?: boolean;
}

export interface UserMenuItem {
  menuName: string;
  icon: string;
  route?: string;
  isOpen?: boolean;
  subMenus?: SubMenuu[];
}

export interface ChildItem {
  label: string;
  link?: string;
  children?: ChildItem[];
  isOpen?: boolean;
}

export interface MenuItem {
  label: string;
  icon: string;
  link?: string;
  isOpen?: boolean;
  children?: ChildItem[];
}
