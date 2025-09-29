import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { derivedAsync } from 'ngxtension/derived-async';
import { TicketService } from '../../../services/ticket.service';
import { Params } from '@angular/router';
import { TicketListView } from './ticket-list-view/ticket-list-view';
import { TicketKanbanView } from './ticket-kanban-view/ticket-kanban-view';

@Component({
  selector: 'app-ticket-centre',
  standalone: true,
  imports: [TicketListView, TicketKanbanView],
  templateUrl: './ticket-centre.html',
  styleUrl: './ticket-centre.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketCentre {
  private readonly ticketService = inject(TicketService);

  readonly viewMode = signal<'list' | 'kanban'>('list');

  setView(mode: 'list' | 'kanban') {
    this.viewMode.set(mode);
  }

  // Example params, replace with actual filter logic as needed
  readonly params = signal<Params>({});

  readonly ticketsResponse = derivedAsync(() => this.ticketService.getTickets(this.params()), {
    initialValue: { items: [], total: 0, page: 1, pageSize: 0 },
  });
}
