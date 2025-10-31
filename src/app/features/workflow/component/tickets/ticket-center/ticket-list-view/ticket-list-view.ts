import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EnumPriority,
  EnumTicketStatus,
  TicketListViewDto,
} from '../../../../models/ticket.model.model';
import { CustomDatePipe } from '@shared/helper/pipes/pipes/custom-date-pipe';
import { EnumToStringPipe } from '@shared/helper/pipes/pipes/enum-to-string-pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  standalone: true,
  selector: 'app-ticket-list-view',
  imports: [CommonModule, EnumToStringPipe, CustomDatePipe, BsDropdownModule],
  templateUrl: './ticket-list-view.html',
  styleUrl: './ticket-list-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketListView {
  @Input() tickets: TicketListViewDto[] = [];
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  EnumPriority = EnumPriority;
  EnumTicketStatus = EnumTicketStatus;

  navigateToTicketDetail(ticketId: number) {
    // this.router.navigate(['/pages/tickets', ticketId], { relativeTo: this.route });
    this.router.navigate(['../', ticketId], { relativeTo: this.route });
  }
}
