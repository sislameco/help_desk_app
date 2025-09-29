import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketListViewDto } from '../../../../models/ticket.model.model';

@Component({
  standalone: true,
  selector: 'app-ticket-list-view',
  imports: [CommonModule],
  templateUrl: './ticket-list-view.html',
  styleUrl: './ticket-list-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketListView {
  @Input() tickets: TicketListViewDto[] = [];
}
