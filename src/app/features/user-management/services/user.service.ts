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
}
