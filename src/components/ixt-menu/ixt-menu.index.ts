// ixt-menu.index.ts
export * from './ixt-menu.component';
export * from './ixt-menu.module';

export interface MenuItem {
  name: string;
  link: string;
}

export interface MenuConfig {
  items: MenuItem[];
  brandName?: string;
  brandLogo?: string;
  brandLink?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  linkAlignment?: 'start' | 'center' | 'end';
}