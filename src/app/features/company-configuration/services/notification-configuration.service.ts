import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  NotificationInputDto,
  NotificationOutputDto,
} from '../models/notification-configuration.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationConfigurationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/notification-configuration`;

  /**
   * ✅ Update notification template
   */
  updateTemplate(input: NotificationInputDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/update-template/${input.id}`, input);
  }

  /**
   * ✅ Enable or disable a notification
   */
  updateIsEnabled(id: number, isEnabled: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/update-enabled/${id}?isEnabled=${isEnabled}`, {});
  }

  /**
   * ✅ Get all active notifications by company
   */
  getAllActiveByCompanyId(
    fkCompanyId: number,
    typeId: number,
  ): Observable<NotificationOutputDto[]> {
    return this.http.get<NotificationOutputDto[]>(
      `${this.baseUrl}/all/${fkCompanyId}?type=${typeId}`,
    );
  }
}
