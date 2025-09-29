import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
@Component({
  selector: 'app-ticket-kanban-view',
  imports: [],
  templateUrl: './ticket-kanban-view.html',
  styleUrl: './ticket-kanban-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketKanbanView {
  //@Input() tickets: any[] = [];
  //@Input() viewMode: 'list' | 'kanban' = 'list';

  readonly statuses = ['Open', 'In Progress', 'Planning', 'Resolved', 'Closed'];

  filteredTicketsByStatus = computed(() => {
    const result: Record<string, unknown[]> = {};
    // Filtering logic should be implemented here if tickets are available
    return result;
  });
}
