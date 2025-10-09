import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationConfigurationService } from '../../services/notification-configuration.service';
import {
  NotificationEvent,
  NotificationInputDto,
  NotificationOutputDto,
  NotificationType,
} from '../../models/notification-configuration.model';

@Component({
  selector: 'app-notification-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./notification-config.scss'],
  templateUrl: './notification-config.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationConfig implements OnInit {
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
  }

  saveChanges(): void {
    if (!this.selectedEvent()) return;
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
}
