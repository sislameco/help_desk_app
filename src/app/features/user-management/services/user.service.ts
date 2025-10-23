import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserCreateUpdateDto, UserFilterDto, Users } from '../models/user-list-model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  saveUser(user: Partial<Users>): Observable<UserCreateUpdateDto> {
    return this.http.post<UserCreateUpdateDto>(environment.apiBaseUrl + '/api/user', user);
  }
  updateUser(id: number, user: Partial<Users>): Observable<UserCreateUpdateDto> {
    return this.http.put<UserCreateUpdateDto>(environment.apiBaseUrl + `/api/user/${id}`, user);
  }
  private readonly http = inject(HttpClient);

  getAll(input: UserFilterDto): Observable<Users[]> {
    return this.http.get<Users[]>(environment.apiBaseUrl + '/api/user', { params: { ...input } });
  }

  getRoleDropdown(): Observable<{ roleId: number; roleName: string }[]> {
    return this.http.get<{ roleId: number; roleName: string }[]>(
      environment.apiBaseUrl + '/api/role/dropdown',
    );
  }
}
