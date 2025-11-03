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
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ticket-linked-items',
  imports: [Dropdown, NgSelectComponent, FormsModule],
  templateUrl: './ticket-linked-items.html',
  styleUrl: './ticket-linked-items.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketLinkedItems {
  ticketId = input<number>();
  companyId = input<number>();
  private readonly ticketService = inject(TicketService);
  private readonly toast = inject(ToastrService);
  isAdding = signal(false);
  refreshTrigger = signal(0);
  selectedLickedItems = linkedSignal(() => this.linkingItems().map((item) => item.id));
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

  ticketDropdownItems = derivedAsync(
    () => {
      return this.ticketService.getCompanyTicketsDdl(Number(this.companyId()));
    },
    {
      initialValue: [],
    },
  );

  toggleAddMode() {
    this.isAdding.update((val) => !val);
  }

  updateLinkedItems() {
    this.ticketService
      .updateTicketLinkings(Number(this.ticketId()), this.selectedLickedItems())
      .subscribe(() => {
        this.refreshTrigger.update((v) => v + 1);
        this.isAdding.set(false);
        this.toast.success('Linked items updated successfully');
      });
  }
}
