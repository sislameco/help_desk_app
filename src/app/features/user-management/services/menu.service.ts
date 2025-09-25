import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuResource } from '../models/menu.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'any',
})
export class MenuService {
  private readonly http = inject(HttpClient);

  menuPermitted() {
    return this.http.get<MenuResource>(`${environment.apiBaseUrl}/api/permission/menu`);
  }
}
