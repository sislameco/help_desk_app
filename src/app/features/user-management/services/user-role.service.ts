import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoleListItemDto, RoleUpsertRequest } from '../models/role.model';
import { PaginationResponse } from '@shared/models/api-response.model';
import { Params } from '@angular/router';
import { environment } from '../../../../environments/environment';
@Injectable({ providedIn: 'any' })
export class UserRoleService {
  private readonly http = inject(HttpClient);

  list(data: Params) {
    return this.http.get<PaginationResponse<RoleListItemDto>>(
      `${environment.userManagementBaseUrl}/roles/paged`,
      {
        params: data,
      },
    );
  }
  roleUpsert(data: RoleUpsertRequest) {
    return this.http.put<void>(
      `${environment.userManagementBaseUrl}/roles/upsert-with-menus`,
      data,
    );
  }
}
