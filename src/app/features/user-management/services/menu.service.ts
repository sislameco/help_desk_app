import { inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from '../models/menu.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'any',
})
export class MenuService {
  private readonly http = inject(HttpClient);

  menuPermitted(data: Params) {
    return this.http.get<MenuItem[]>(`${environment.apiBaseUrl}/menus/permitted-tree`, {
      params: data,
    });
  }
}
