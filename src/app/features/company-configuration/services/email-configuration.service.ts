import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SLAInputDto, SLAOutputDto } from '../models/sla.model';
@Injectable({
  providedIn: 'root',
})
export class SLAService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/sla`;

  getAll(): Observable<SLAOutputDto[]> {
    return this.http.get<SLAOutputDto[]>(`${this.baseUrl}`);
  }

  getById(id: number): Observable<SLAOutputDto> {
    return this.http.get<SLAOutputDto>(`${this.baseUrl}/${id}`);
  }

  create(dto: SLAInputDto): Observable<SLAOutputDto> {
    return this.http.post<SLAOutputDto>(`${this.baseUrl}`, dto);
  }

  update(id: number, dto: SLAInputDto): Observable<SLAOutputDto> {
    return this.http.put<SLAOutputDto>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
