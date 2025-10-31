import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { derivedAsync } from 'ngxtension/derived-async';
import { TicketService } from '../../../../services/ticket.service';
import { Dropdown } from '@shared/helper/components/dropdown/dropdown';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-ticket-linked-items',
  imports: [Dropdown, NgSelectComponent],
  templateUrl: './ticket-linked-items.html',
  styleUrl: './ticket-linked-items.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketLinkedItems {
  ticketId = input<number>();
  private readonly ticketService = inject(TicketService);
  refreshTrigger = signal(0);
  linkingItems = linkedSignal(() => this.linkingItemsSignal());
  readonly linkingItemsSignal = derivedAsync(
    () => {
      this.refreshTrigger();
      return this.ticketService.getTicketLinkings(Number(this.ticketId()));
    },
    {
      initialValue: [],
    },
  );
}
