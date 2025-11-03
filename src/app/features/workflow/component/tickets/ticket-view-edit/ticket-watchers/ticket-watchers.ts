import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { derivedAsync } from 'ngxtension/derived-async';
import { TicketService } from '../../../../services/ticket.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-watchers',
  imports: [FormsModule, NgSelectComponent],
  templateUrl: './ticket-watchers.html',
  styleUrl: './ticket-watchers.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketWatchers {
  ticketId = input<number>();
  private readonly ticketService = inject(TicketService);
  selectedWatchers: number[] = [];
  readonly refreshTrigger = signal(0);
  readonly watchers = derivedAsync(
    () => {
      this.refreshTrigger();
      return this.ticketService.getTicketWatchers(Number(this.ticketId()));
    },
    {
      initialValue: [],
    },
  );
}
