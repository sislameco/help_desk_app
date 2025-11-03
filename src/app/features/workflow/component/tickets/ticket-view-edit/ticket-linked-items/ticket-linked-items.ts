import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { derivedAsync } from 'ngxtension/derived-async';
import { TicketService } from '../../../../services/ticket.service';
import { Dropdown } from '@shared/helper/components/dropdown/dropdown';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';

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
  selectedLinkedItems: number[] = [];
  linkedItemsToExclude = computed(() => [
    Number(this.ticketId()),
    ...this.linkingItemsSignal().map((item) => item.linkingTicketId),
  ]);
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
      this.refreshTrigger();
      return this.ticketService
        .getCompanyTicketsDdl(Number(this.companyId()))
        .pipe(
          map((items) => items.filter((item) => !this.linkedItemsToExclude().includes(item.id))),
        );
    },
    {
      initialValue: [],
    },
  );

  toggleAddMode() {
    this.isAdding.update((val) => !val);
  }

  addLinkedItems() {
    this.ticketService
      .addTicketLinkings(Number(this.ticketId()), this.selectedLinkedItems)
      .subscribe({
        next: () => {
          this.refreshTrigger.update((v) => v + 1);
          this.isAdding.set(false);
          this.toast.success('Linked items added successfully');
          this.selectedLinkedItems = [];
        },
        error: () => {
          this.toast.error('Error adding linked items');
        },
      });
  }

  deleteLinking(linkingId: number) {
    this.ticketService.deleteTicketLinking(linkingId).subscribe({
      next: () => {
        this.refreshTrigger.update((v) => v + 1);
        this.toast.success('Linking item deleted successfully');
      },
      error: () => {
        this.toast.error('Error deleting linking item');
      },
    });
  }
}
