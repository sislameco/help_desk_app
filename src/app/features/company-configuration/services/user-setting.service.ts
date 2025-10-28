import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserSettingPaginationInputDto,
  UserSetupInputDto,
  UserSetupOutputDto,
} from '../models/user-setting.model';
import { PaginationResponse } from '@shared/models/api-response.model';
import { environment } from '../../../../environments/environment';
import { EnumSortBy } from '@shared/enums/sort-by.enum';

@Injectable({
  providedIn: 'root',
})
export class UserSettingService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/tenant-user`; // adjust if needed

  // ✅ Get all users by companyId (with pagination/filter)
  getAllUsers(
    companyId: number,
    input: UserSettingPaginationInputDto,
  ): Observable<PaginationResponse<UserSetupOutputDto>> {
    let params = new HttpParams();
    if (input.departmentIds) {
      input.departmentIds.forEach((id) => {
        params = params.append('departmentIds', id.toString());
      });
    }
    // if (input.moduleIds) {
    //   input.moduleIds.forEach((id) => {
    //     params = params.append('moduleIds', id.toString());
    //   });
    // }
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

    return this.http.get<PaginationResponse<UserSetupOutputDto>>(
      `${this.baseUrl}/all/${companyId}`,
      { params },
    );
  }

  // ✅ Get user by id
  getUserById(id: number): Observable<UserSetupOutputDto> {
    return this.http.get<UserSetupOutputDto>(`${this.baseUrl}/${id}`);
  }

  // ✅ Update user
  updateUser(dto: UserSetupInputDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/update`, dto);
  }

  // ✅ Delete user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}?id=${id}`);
  }
  getUserStatistics(
    companyId: number,
    input: UserSettingPaginationInputDto,
  ): Observable<{
    totalUsers: number;
    activeUsers: number;
    admins: number;
    departments: number;
  }> {
    let params = new HttpParams();
    if (input.departmentIds) {
      input.departmentIds.forEach((id) => {
        params = params.append('departmentIds', id.toString());
      });
    }
    // if (input.moduleIds) {
    //   input.moduleIds.forEach((id) => {
    //     params = params.append('moduleIds', id.toString());
    //   });
    // }
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
      totalUsers: number;
      activeUsers: number;
      admins: number;
      departments: number;
    }>(`${this.baseUrl}/tiles/${companyId}`, { params });
  }
}
