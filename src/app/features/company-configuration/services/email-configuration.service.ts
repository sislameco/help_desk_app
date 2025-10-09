import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { EmailConfigInputDto, EmailConfigurationOutput } from '../models/email-configuration-model';
@Injectable({
  providedIn: 'root',
})
export class EmailConfigurationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/email-configuration`;

  updateFields(input: EmailConfigInputDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/update`, input);
  }

  setDefault(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/set-default/${id}`, {});
  }

  getAllActiveByCompanyId(fkCompanyId: number): Observable<EmailConfigurationOutput[]> {
    return this.http.get<EmailConfigurationOutput[]>(`${this.baseUrl}/all/${fkCompanyId}`);
  }
}
