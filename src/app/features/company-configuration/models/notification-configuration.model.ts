import { NotificationEvent } from './email-configuration-model';

export interface NotificationOutputDto {
  id: number;
  event: NotificationEvent;
  notificationType: NotificationType;
  subjectTemplate: string;
  bodyTemplate: string;
  headerTemplate: string;
  footerTemplate: string;
}

export enum NotificationType {
  Email = 1,
  SMS = 2,
  App = 3,
  System = 4,
}

export interface NotificationInputDto {
  id: number;
  emailConfigurationId: number;
  subjectTemplate: string;
  bodyTemplate: string;
  ccList: string;
}
export { NotificationEvent };

