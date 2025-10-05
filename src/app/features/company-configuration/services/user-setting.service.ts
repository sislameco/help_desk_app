import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserPaginationInputDto,
  UserSetupInputDto,
  UserSetupOutputDto,
} from '../models/user-setting.model';
import { PaginationResponse } from '@shared/models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class UserSettingService {
  private http = inject(HttpClient);
  private readonly baseUrl = '/api/tenant-user'; // adjust if needed

  // ✅ Get all users by companyId (with pagination/filter)
  getAllUsers(
    companyId: number,
    input: UserPaginationInputDto,
  ): Observable<PaginationResponse<UserSetupOutputDto>> {
    let params = new HttpParams();
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
}
