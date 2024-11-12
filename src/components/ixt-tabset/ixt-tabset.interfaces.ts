export interface ITabContent {
  id: string;
  title: string;
  content: string;
  active: boolean;
}

export interface ITabsetConfig {
  notificationText?: string;
  showNotificationBand?: boolean;
  animationDuration?: number;
}
