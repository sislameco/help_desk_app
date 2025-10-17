import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PaginationResponse } from '@shared/models/api-response.model';
import { AddTicketInputDto, TicketListViewDto } from '../models/ticket.model.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private readonly http = inject(HttpClient);

  getTickets(data: Params) {
    return this.http.get<PaginationResponse<TicketListViewDto>>(
      `${environment.apiBaseUrl}/api/ticket/list`,
      {
        params: data,
      },
    );
  }
  createTicket(input: AddTicketInputDto): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiBaseUrl}/api/ticket/create`, input);
  }
}
