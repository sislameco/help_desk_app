import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CustomFieldDto,
  CustomFieldOutputDto,
  TicketTypeDropdownDto,
} from '../models/data-config.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomDefineDataSourceService {
  private http = inject(HttpClient);

  // Base API endpoint (adjust if needed, e.g., '/api/field')
  private readonly baseUrl = `${environment.apiBaseUrl}/api/field`;

  getTicketTypes(companyId: number): Observable<TicketTypeDropdownDto[]> {
    return this.http.get<TicketTypeDropdownDto[]>(
      `${this.baseUrl}/ticket-type?companyId=${companyId}`,
    );
  }

  /** 🔹 Get all fields */
  getAll(): Observable<CustomFieldOutputDto[]> {
    return this.http.get<CustomFieldOutputDto[]>(this.baseUrl);
  }

  /** 🔹 Get single field by ID */
  getById(id: number): Observable<CustomFieldOutputDto> {
    return this.http.get<CustomFieldOutputDto>(`${this.baseUrl}/${id}`);
  }

  /** 🔹 Create multiple fields */
  createMany(dtos: CustomFieldDto): Observable<CustomFieldDto> {
    return this.http.post<CustomFieldDto>(this.baseUrl, dtos);
  }

  /** 🔹 Update field by ID */
  update(id: number, dto: CustomFieldDto): Observable<CustomFieldDto> {
    return this.http.put<CustomFieldDto>(`${this.baseUrl}/${id}`, dto);
  }

  /** 🔹 Delete field by ID */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
