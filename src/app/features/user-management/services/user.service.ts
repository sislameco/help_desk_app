import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserFilterDto, Users } from '../models/user-list-model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
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
