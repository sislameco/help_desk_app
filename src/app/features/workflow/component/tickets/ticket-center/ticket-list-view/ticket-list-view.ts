import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EnumPriority,
  EnumTicketStatus,
  TicketListViewDto,
} from '../../../../models/ticket.model.model';
import { CustomDatePipe } from '@shared/helper/pipes/pipes/custom-date-pipe';
import { EnumToStringPipe } from '@shared/helper/pipes/pipes/enum-to-string-pipe';

@Component({
  standalone: true,
  selector: 'app-ticket-list-view',
  imports: [CommonModule, EnumToStringPipe, CustomDatePipe],
  templateUrl: './ticket-list-view.html',
  styleUrl: './ticket-list-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketListView {
  @Input() tickets: TicketListViewDto[] = [];
  EnumPriority = EnumPriority;
  EnumTicketStatus = EnumTicketStatus;
}
