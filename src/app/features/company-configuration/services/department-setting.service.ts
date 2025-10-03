import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PaginationResponse } from '@shared/models/api-response.model';
import {
  DepartmentSettingInputDto,
  DepartmentSettingOutputDto,
} from '../models/department-setting.model';

@Injectable({ providedIn: 'root' })
export class DepartmentSettingService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/department-setting`;

  getAllDepartments(
    companyId: number,
    input: DepartmentSettingInputDto,
  ): Observable<PaginationResponse<DepartmentSettingOutputDto>> {
    let params = new HttpParams();
    if (input.userIds) {
      input.userIds.forEach((id) => {
        params = params.append('UserIds', id.toString());
      });
    }
    if (input.searchText) {
      params = params.set('SearchText', input.searchText);
    }
    if (input.status !== undefined) {
      params = params.set('Status', input.status.toString());
    }
    if (input.pageNo !== undefined) {
      params = params.set('PageNo', input.pageNo.toString());
    }
    if (input.itemsPerPage !== undefined) {
      params = params.set('ItemsPerPage', input.itemsPerPage.toString());
    }

    return this.http.get<PaginationResponse<DepartmentSettingOutputDto>>(
      `${this.baseUrl}/all/${companyId}`,
      { params },
    );
  }
}
