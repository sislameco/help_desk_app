export interface EmailConfigInputDto {
  id: number;
  userName: string;
  name: string;
  replyTo: string;
  bcc: string[];
  ccList: string[];
}
export interface EmailConfigurationOutput extends EmailConfigInputDto {
  password: string;
  host: string;
  smtpPort: number;
  imapPort: number;
  accessKey: string;
  secretKey: string;
  isDefault: boolean;
  event: NotificationEvent;
}

export enum NotificationEvent {
  Created = 1,
  Updated = 2,
  Resolved = 3,
  Closed = 4,
  SLADue = 5,
  SLAOverdue = 6,
  RecoveryPassword = 7,
  UserInvitation = 8,
}
