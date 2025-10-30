import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PaginationResponse } from '@shared/models/api-response.model';
import {
  AddTicketInputDto,
  TicketBasicDetailOutputDto,
  TicketCommentOutputDto,
  TicketFieldOutputDto,
  TicketFileDto,
  TicketLinkingItemOutputDto,
  TicketListViewDto,
  TicketSpecificationOutputDto,
  TicketWatcherOutputDto,
} from '../models/ticket.model.model';
import { Observable } from 'rxjs';

export class TicketService {
  private readonly http = inject(HttpClient);

  getTickets(companyId: number, data: Params) {
    return this.http.get<PaginationResponse<TicketListViewDto>>(
      `${environment.apiBaseUrl}/api/ticket/list?companyId=${companyId}`,
      {
        params: data,
      },
    );
  }
  createTicket(input: AddTicketInputDto): Observable<boolean> {
    return this.http.post<boolean>(`${environment.apiBaseUrl}/api/ticket/create`, input);
  }

  // Ticket details apis
  getTicketBasicDetails(ticketId: number): Observable<TicketBasicDetailOutputDto> {
    return this.http.get<TicketBasicDetailOutputDto>(
      `${environment.apiBaseUrl}/api/ticket/basic-detail/${ticketId}`,
    );
  }

  getTicketSpecifications(ticketId: number): Observable<TicketSpecificationOutputDto> {
    return this.http.get<TicketSpecificationOutputDto>(
      `${environment.apiBaseUrl}/api/ticket/specification/${ticketId}`,
    );
  }

  getTicketAttachments(ticketId: number): Observable<TicketFileDto> {
    return this.http.get<TicketFileDto>(
      `${environment.apiBaseUrl}/api/ticket/attachment/${ticketId}`,
    );
  }

  getTicketLinkings(ticketId: number): Observable<TicketLinkingItemOutputDto> {
    return this.http.get<TicketLinkingItemOutputDto>(
      `${environment.apiBaseUrl}/api/ticket/linking-item/${ticketId}`,
    );
  }

  getTicketComments(ticketId: number): Observable<TicketCommentOutputDto> {
    return this.http.get<TicketCommentOutputDto>(
      `${environment.apiBaseUrl}/api/ticket/comments/${ticketId}`,
    );
  }

  getTicketFields(ticketId: number): Observable<TicketFieldOutputDto> {
    return this.http.get<TicketFieldOutputDto>(
      `${environment.apiBaseUrl}/api/ticket/get-define-field/${ticketId}`,
    );
  }

  getTicketWatchers(ticketId: number): Observable<TicketWatcherOutputDto> {
    return this.http.get<TicketWatcherOutputDto>(
      `${environment.apiBaseUrl}/api/ticket/get-watchers/${ticketId}`,
    );
  }
}
