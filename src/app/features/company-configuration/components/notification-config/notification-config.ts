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
import { ActivatedRoute } from '@angular/router';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-notification-config',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEditorModule, NgSelectComponent, NgOptionComponent],
  styleUrls: ['./notification-config.scss'],
  templateUrl: './notification-config.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationConfig implements OnInit, OnDestroy {
  editorRef!: Editor;
  html = signal<string>('');
  availableVariables: string[] = [];
  subject = signal<string>('');
  enumNotificationType = NotificationType;
  private readonly service = inject(NotificationConfigurationService);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastrService);
  NotificationEvent = NotificationEvent;
  NotificationType = NotificationType;

  fkCompanyId = 0;

  notifications = signal<NotificationOutputDto[]>([]);
  selectedEvent = signal<NotificationOutputDto | null>(null);
  selectedType = signal<NotificationType>(NotificationType.Email);
  isLoading = signal<boolean>(false);

  // ✅ Enum View Models (safe iteration)
  notificationEvents = Object.entries(NotificationEvent)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({ key, value: value as NotificationEvent }));

  notificationTypes = Object.entries(NotificationType)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({ key, value: value as NotificationType }));

  template: NotificationInputDto = {
    id: 0,
    emailConfigurationId: 0,
    subjectTemplate: '',
    bodyTemplate: '',
    ccList: '',
    isEnabled: false,
  };

  ngOnInit(): void {
    this.fkCompanyId = +this.route.snapshot.parent?.params['id'] || 0;
    this.loadNotifications();
    this.editorRef = new Editor();
    this.notificationTypes.sort((a, b) => a.value - b.value);
  }
  ngOnDestroy() {
    this.editorRef.destroy();
  }
  loadNotifications(): void {
    this.selectedEvent.set(null);
    this.isLoading.set(true);
    this.service.getAllActiveByCompanyId(this.fkCompanyId, this.selectedType()).subscribe({
      next: (res) => {
        const patched = this.patchNotificationNames(res);
        this.notifications.set(patched);
        this.isLoading.set(false);
        if (patched.length) {
          this.selectEvent(patched[0]);
        }
      },
      error: () => this.isLoading.set(false),
    });
  }

  selectEvent(evt: NotificationOutputDto): void {
    this.template = {
      id: evt.id,
      emailConfigurationId: 0,
      subjectTemplate: evt.subjectTemplate,
      bodyTemplate: evt.bodyTemplate,
      ccList: '',
      isEnabled: evt.isEnabled,
    };
    this.html.set(evt.bodyTemplate);
    this.subject.set(evt.subjectTemplate);
    this.availableVariables = evt.variables;
    this.selectedEvent.set(evt);
  }

  saveChanges(): void {
    if (!this.selectedEvent()) {
      return;
    }
    this.template.bodyTemplate = this.html();
    this.template.subjectTemplate = this.subject();
    this.template.id = this.selectedEvent()!.id;
    this.service.updateTemplate(this.template).subscribe({
      next: () => {
        this.toast.success('Notification template updated successfully!');
        this.notifications.update((notifs) =>
          notifs.map((notif) =>
            notif.id === this.template.id
              ? {
                  ...notif,
                  bodyTemplate: this.template.bodyTemplate,
                  subjectTemplate: this.template.subjectTemplate,
                }
              : notif,
          ),
        );
      },
    });
  }

  toggleEnabled(id: number, enabled: boolean): void {
    this.service.updateIsEnabled(id, enabled).subscribe({
      next: () => {
        this.toast.success(`Notification ${enabled ? 'enabled' : 'disabled'}`);
        const updatedNotifications = this.notifications().map((notif) =>
          notif.id === id ? { ...notif, isEnabled: enabled } : notif,
        );
        this.notifications.set(updatedNotifications);
        const changedNotification = this.notifications().find((n) => n.id === id) || null;
        this.selectedEvent.set(changedNotification);
      },
    });
  }

  patchNotificationNames(notifications: NotificationOutputDto[]): NotificationOutputDto[] {
    return notifications.map((notification) => ({
      ...notification,
      notificationName: `${this.getEventName(notification.event)} (${this.getTypeName(
        notification.notificationType,
      )})`,
    }));
  }

  getEventName(event: NotificationEvent): string {
    return NotificationEvent[event];
  }

  getTypeName(type: NotificationType): string {
    return NotificationType[type];
  }
  copyVariable(variable: string) {
    navigator.clipboard.writeText(variable);
    this.toast.success(`Copied: ${variable}`);
  }
}
