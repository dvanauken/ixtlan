// ixt-menu.model.ts
export interface MenuNode {
    label: string;
    icon?: string;
    route?: string;
    children?: MenuNode[];
  }
  