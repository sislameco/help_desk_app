import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddTicketModal } from '../ticket-add-modal/add-ticket-modal/add-ticket-modal';
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
  providers: [BsModalService],
})
export class TicketCentre {
  private readonly ticketService = inject(TicketService);
  private readonly modalService = inject(BsModalService);

  readonly viewMode = signal<'list' | 'kanban'>('list');

  setView(mode: 'list' | 'kanban') {
    this.viewMode.set(mode);
  }

  readonly params = signal<Params>({});

  readonly ticketsResponse = derivedAsync(() => this.ticketService.getTickets(1, this.params()), {
    initialValue: { items: [], total: 0, page: 1, pageSize: 0 },
  });

  openAddTicket() {
    this.modalService.show(AddTicketModal, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl',
    });
  }
}
