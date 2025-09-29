import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  RoleInput,
  RoleListItemDto,
  RoleUpsertRequest,
  RoleWithUsersDto,
} from '../models/role.model';
import { PaginationResponse } from '@shared/models/api-response.model';
import { Params } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'any' })
export class UserRoleService {
  private readonly http = inject(HttpClient);

  list(data: Params) {
    return this.http.get<PaginationResponse<RoleListItemDto>>(
      `${environment.apiBaseUrl}/roles/paged`,
      {
        params: data,
      },
    );
  }
  roleUpsert(data: RoleUpsertRequest) {
    return this.http.put<void>(`${environment.apiBaseUrl}/roles/upsert-with-menus`, data);
  }
  getRolesWithUsers(data: Params) {
    return this.http.get<PaginationResponse<RoleWithUsersDto>>(
      `${environment.apiBaseUrl}/api/role/all`,
      {
        params: data,
      },
    );
  }
  createRole(role: RoleInput): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/api/role`, role);
  }
  updateRole(roleId: number, role: RoleInput): Observable<void> {
    return this.http.put<void>(`${environment.apiBaseUrl}/api/role/${roleId}`, role);
  }
  deleteRole(roleId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/api/role/${roleId}`);
  }
}
