import { NotificationEvent } from './email-configuration-model';

export interface NotificationTemplateDto {
  fkCompanyId: number;
  event: NotificationEvent;
  notificationType: NotificationType;
  emailConfigurationId?: number | null;
  subjectTemplate: string;
  bodyTemplate: string;
  isEnabled: boolean;
  variables: string[];
}

export enum NotificationType {
  Email = 1,
  SMS = 2,
  App = 3,
  System = 4,
}
