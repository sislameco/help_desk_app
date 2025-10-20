import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EnumRootResolutionType,
  RootCauseInputDto,
  RootCauseOutDto,
} from '../models/root-resolution.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RootResolutionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/root-resolution`;

  getAll(companyId: number, type: EnumRootResolutionType): Observable<RootCauseOutDto[]> {
    return this.http.get<RootCauseOutDto[]>(`${this.baseUrl}?companyId=${companyId}&type=${type}`);
  }

  getById(id: number): Observable<RootCauseOutDto> {
    return this.http.get<RootCauseOutDto>(`${this.baseUrl}/${id}`);
  }

  save(model: RootCauseInputDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}`, model);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  changeDisplayOrder(id: number, order: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/displayorder?id=${id}&order=${order}`, {});
  }
}
