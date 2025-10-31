import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
import {
  EnumPriority,
  EnumTicketStatus,
  TicketListViewDto,
} from '../../../../models/ticket.model.model';
import { enumToArray } from '@shared/helper/enum-ddl-helpers';
import { EnumToStringPipe } from '@shared/helper/pipes/pipes/enum-to-string-pipe';
import { CustomDatePipe } from '@shared/helper/pipes/pipes/custom-date-pipe';
@Component({
  selector: 'app-ticket-kanban-view',
  imports: [EnumToStringPipe, CustomDatePipe],
  templateUrl: './ticket-kanban-view.html',
  styleUrl: './ticket-kanban-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketKanbanView {
  @Input() tickets: TicketListViewDto[] = [];
  @Input() viewMode: 'list' | 'kanban' = 'list';

  statuses = enumToArray(EnumTicketStatus);
  EnumPriority = EnumPriority;
  EnumTicketStatus = EnumTicketStatus;
  readonly filteredTicketsByStatus = computed(() => {
    const tickets = this.tickets;
    const grouped: Record<string, TicketListViewDto[]> = {};

    this.statuses.forEach((status) => {
      grouped[status.value] = tickets.filter((t) => t.status === status.value);
    });

    return grouped;
  });
  stripHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}
