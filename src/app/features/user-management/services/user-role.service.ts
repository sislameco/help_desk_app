import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoleListItemDto, RoleUpsertRequest, RoleWithUsersDto } from '../models/role.model';
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
      `${environment.apiBaseUrl}/role/all`,
      {
        params: data,
      },
    );
  }
}
