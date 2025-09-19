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
