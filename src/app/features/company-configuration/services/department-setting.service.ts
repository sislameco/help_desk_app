import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PaginationResponse } from '@shared/models/api-response.model';
import {
  DepartmentSettingInputDto,
  DepartmentSettingOutputDto,
  DepartmentSetupOutputDto,
  DepartmentUpdateDto,
} from '../models/department-setting.model';
import { EnumSortBy } from '@shared/enums/sort-by.enum';

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
    if (input.moduleIds) {
      input.moduleIds.forEach((id) => {
        params = params.append('moduleIds', id.toString());
      });
    }
    if (input.search) {
      params = params.set('SearchText', input.search);
    }
    if (input.status !== undefined) {
      params = params.set('Status', input.status.toString());
    }
    if (input.page !== undefined) {
      params = params.set('PageNo', input.page.toString());
    }
    if (input.pageSize !== undefined) {
      params = params.set('ItemsPerPage', input.pageSize.toString());
    }
    params = params.set('sortColumn', input.sortColumn?.toString() ?? 'name');
    params = params.set('sortBy', input.sortBy?.toString() ?? EnumSortBy.ASC);

    return this.http.get<PaginationResponse<DepartmentSettingOutputDto>>(
      `${this.baseUrl}/all/${companyId}`,
      { params },
    );
  }
  updateDepartment(dto: DepartmentUpdateDto): Observable<boolean> {
    return this.http.patch<boolean>(`${this.baseUrl}/update`, dto);
  }
  getDepById(id: number): Observable<DepartmentSetupOutputDto> {
    return this.http.get<DepartmentSetupOutputDto>(`${this.baseUrl}/${id}`);
  }

  getDepartmentStatistics(
    companyId: number,
    input: DepartmentSettingInputDto,
  ): Observable<{
    total: number;
    active: number;
    totalUser: number;
    avgPerDept: number;
  }> {
    let params = new HttpParams();
    if (input.userIds) {
      input.userIds.forEach((id) => {
        params = params.append('UserIds', id.toString());
      });
    }
    if (input.moduleIds) {
      input.moduleIds.forEach((id) => {
        params = params.append('moduleIds', id.toString());
      });
    }
    if (input.search) {
      params = params.set('SearchText', input.search);
    }
    if (input.status !== undefined) {
      params = params.set('Status', input.status.toString());
    }
    if (input.page !== undefined) {
      params = params.set('PageNo', input.page.toString());
    }
    if (input.pageSize !== undefined) {
      params = params.set('ItemsPerPage', input.pageSize.toString());
    }
    params = params.set('sortColumn', input.sortColumn?.toString() ?? 'name');
    params = params.set('sortBy', input.sortBy?.toString() ?? EnumSortBy.ASC);

    return this.http.get<{
      total: number;
      active: number;
      totalUser: number;
      avgPerDept: number;
    }>(`${this.baseUrl}/tiles/${companyId}`, { params });
  }

  getModuleDropdown(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(
      `${environment.apiBaseUrl}/api/ticket-reference/modules`,
    );
  }

  getDepartmentDropdown(companyId: number): Observable<{ id: number; fullName: string }[]> {
    return this.http.get<{ id: number; fullName: string }[]>(
      `${environment.apiBaseUrl}/api/department-setting/dropdown?companyId=${companyId}`,
    );
  }
}
