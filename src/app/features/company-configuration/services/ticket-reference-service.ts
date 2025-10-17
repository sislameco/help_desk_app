import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CustomerOutputDto,
  DropdownOutputDto,
  FieldOutputDto,
  ProjectOutputDto,
} from '../models/ddl.model';

@Injectable({ providedIn: 'root' })
export class TicketReferenceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/ticket`;

  getDepartments(fkCompanyId: number): Observable<DropdownOutputDto> {
    const params = new HttpParams().set('fkCompanyId', fkCompanyId);
    return this.http.get<DropdownOutputDto>(`${this.baseUrl}/department`, { params });
  }

  getTicketTypes(fkCompanyId: number): Observable<DropdownOutputDto> {
    const params = new HttpParams().set('fkCompanyId', fkCompanyId);
    return this.http.get<DropdownOutputDto>(`${this.baseUrl}/ticket-type`, { params });
  }

  getRootCauses(fkCompanyId: number): Observable<DropdownOutputDto> {
    const params = new HttpParams().set('fkCompanyId', fkCompanyId);
    return this.http.get<DropdownOutputDto>(`${this.baseUrl}/root-cause`, { params });
  }

  getRelocations(fkCompanyId: number): Observable<DropdownOutputDto> {
    const params = new HttpParams().set('fkCompanyId', fkCompanyId);
    return this.http.get<DropdownOutputDto>(`${this.baseUrl}/relocation`, { params });
  }

  getCustomers(fkCompanyId: number): Observable<CustomerOutputDto> {
    const params = new HttpParams().set('fkCompanyId', fkCompanyId);
    return this.http.get<CustomerOutputDto>(`${this.baseUrl}/customer`, { params });
  }

  getProjects(fkCompanyId: number): Observable<ProjectOutputDto> {
    const params = new HttpParams().set('fkCompanyId', fkCompanyId);
    return this.http.get<ProjectOutputDto>(`${this.baseUrl}/project`, { params });
  }

  getUsers(fkCompanyId: number): Observable<DropdownOutputDto> {
    const params = new HttpParams().set('fkCompanyId', fkCompanyId);
    return this.http.get<DropdownOutputDto>(`${this.baseUrl}/user`, { params });
  }

  getSubforms(ticketTypeId: number): Observable<FieldOutputDto> {
    return this.http.get<FieldOutputDto>(`${this.baseUrl}/subform/${ticketTypeId}`);
  }
}
