import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketTypeInputDto, TicketTypeOutputDto } from '../models/ticket-type.model';
import { environment } from '../../../../environments/environment';

// =======================
// 💼 Service
// =======================
@Injectable({
  providedIn: 'root',
})
export class TicketTypeService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/ticket-type`; // as per TicketTypeController route
  private readonly http = inject(HttpClient); // ✅ constructor inject()

  constructor() {}

  // 🔹 Get all ticket types
  getAll(): Observable<TicketTypeOutputDto[]> {
    return this.http.get<TicketTypeOutputDto[]>(`${this.baseUrl}`);
  }

  // 🔹 Get ticket type by ID
  getById(id: number): Observable<TicketTypeOutputDto> {
    return this.http.get<TicketTypeOutputDto>(`${this.baseUrl}/${id}`);
  }

  // 🔹 Create new ticket type
  create(dto: TicketTypeInputDto): Observable<TicketTypeOutputDto> {
    return this.http.post<TicketTypeOutputDto>(`${this.baseUrl}`, dto);
  }

  // 🔹 Update existing ticket type
  update(id: number, dto: TicketTypeInputDto): Observable<TicketTypeOutputDto> {
    return this.http.put<TicketTypeOutputDto>(`${this.baseUrl}/${id}`, dto);
  }

  // 🔹 Delete ticket type
  delete(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${id}`);
  }
}
