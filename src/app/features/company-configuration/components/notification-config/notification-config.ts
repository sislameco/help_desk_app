import {
  Component,
  OnInit,
  signal,
  inject,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationConfigurationService } from '../../services/notification-configuration.service';
import {
  NotificationEvent,
  NotificationInputDto,
  NotificationOutputDto,
  NotificationType,
} from '../../models/notification-configuration.model';
import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-notification-config',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEditorModule],
  styleUrls: ['./notification-config.scss'],
  templateUrl: './notification-config.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationConfig implements OnInit, OnDestroy {
  editorRef!: Editor;
  html = signal<string>('');
  subject = signal<string>('');
  private readonly service = inject(NotificationConfigurationService);
  NotificationEvent = NotificationEvent;
  NotificationType = NotificationType;

  fkCompanyId = 1;

  notifications = signal<NotificationOutputDto[]>([]);
  selectedEvent = signal<NotificationOutputDto | null>(null);
  selectedType = signal<NotificationType>(NotificationType.Email);
  isLoading = signal<boolean>(false);

  // ✅ Enum View Models (safe iteration)
  notificationEvents = Object.entries(NotificationEvent)
    .filter(([key, value]) => isNaN(Number(key)))
    .map(([key, value]) => ({ key, value: value as NotificationEvent }));

  notificationTypes = Object.entries(NotificationType)
    .filter(([key, value]) => isNaN(Number(key)))
    .map(([key, value]) => ({ key, value: value as NotificationType }));

  template: NotificationInputDto = {
    id: 0,
    emailConfigurationId: 0,
    subjectTemplate: '',
    bodyTemplate: '',
    ccList: '',
  };

  availableVariables: string[] = [
    '[ticket_id]',
    '[ticket_title]',
    '[ticket_type]',
    '[ticket_priority]',
    '[ticket_status]',
    '[assigned_to]',
    '[created_date]',
    '[due_date]',
    '[department]',
    '[description]',
  ];

  ngOnInit(): void {
    this.loadNotifications();
    this.editorRef = new Editor();
  }
  ngOnDestroy() {
    this.editorRef.destroy();
  }
  loadNotifications(): void {
    this.isLoading.set(true);
    this.service.getAllActiveByCompanyId(this.fkCompanyId).subscribe({
      next: (res) => {
        this.notifications.set(res);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  // ✅ Select event/type
  selectEvent(evt: NotificationOutputDto, type: NotificationType): void {
    this.selectedEvent.set(evt);
    this.selectedType.set(type);
    this.template = {
      id: evt.id,
      emailConfigurationId: 0,
      subjectTemplate: evt.subjectTemplate,
      bodyTemplate: evt.bodyTemplate,
      ccList: '',
    };
    this.html.set(evt.bodyTemplate);
    this.subject.set(evt.subjectTemplate);
  }

  saveChanges(): void {
    if (!this.selectedEvent()) {
      return;
    }
    this.template.bodyTemplate = this.html();
    this.template.subjectTemplate = this.subject();
    this.template.id = this.selectedEvent()!.id;
    this.service.updateTemplate(this.template).subscribe({
      next: () => alert('Notification template updated successfully!'),
    });
  }

  toggleEnabled(id: number, enabled: boolean): void {
    this.service.updateIsEnabled(id, enabled).subscribe({
      next: () => alert(`Notification ${enabled ? 'enabled' : 'disabled'}`),
    });
  }

  getEventName(event: NotificationEvent): string {
    return NotificationEvent[event];
  }

  getTypeName(type: NotificationType): string {
    return NotificationType[type];
  }
  copyVariable(variable: string) {
    navigator.clipboard.writeText(variable);
    alert(`Copied: ${variable}`);
  }
}
