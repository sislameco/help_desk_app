import { afterNextRender, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddTicketModal } from '../ticket-add-modal/add-ticket-modal/add-ticket-modal';
import { derivedAsync } from 'ngxtension/derived-async';
import { TicketService } from '../../../services/ticket.service';
import { TicketListView } from './ticket-list-view/ticket-list-view';
import { TicketKanbanView } from './ticket-kanban-view/ticket-kanban-view';
import { Breadcrumbs } from '@shared/helper/components/breadcrumbs/breadcrumbs';
import { TicketFilter } from './ticket-filter/ticket-filter';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@shared/const/pagination.const';
import { FilterParams } from '@shared/helper/classes/filter-params.class';
import { TicketListFilterParams, TicketRequest } from '../../../models/ticket.model.model';
import { shareReplay, Subject, takeUntil } from 'rxjs';
import { toNums } from '@shared/helper/functions/common.function';
import { EnumSortBy } from '@shared/enums/sort-by.enum';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticket-centre',
  standalone: true,
  imports: [TicketListView, TicketKanbanView, Breadcrumbs, TicketFilter],
  templateUrl: './ticket-centre.html',
  styleUrl: './ticket-centre.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService, TicketService],
})
export class TicketCentre {
  readonly route = inject(ActivatedRoute);
  private readonly ticketService = inject(TicketService);
  private readonly modalService = inject(BsModalService);

  private ngUnsubscribe$ = new Subject<void>();

  readonly viewMode = signal<'list' | 'kanban'>('list');
  selectedTicketTypeIds = signal<number[]>([]);

  setView(mode: 'list' | 'kanban') {
    this.viewMode.set(mode);
  }
  readonly filters = new FilterParams<TicketListFilterParams>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  private readonly refresh = signal(0);
  readonly ticketsResponse = derivedAsync(() => {
    this.refresh();
    const params = this.mapToProductRequest(this.filters.value());
    //todo need to remove shareReply
    return this.ticketService.getTickets(1, params).pipe(shareReplay(1));
  });

  constructor() {
    this.listenQueryParams();
    afterNextRender(async () => {
      // const list = await firstValueFrom(this.userProductFilterService.userProductFilters(true));

      // if (!this.hasAppliedDefaultOnInit()) {
      //   const def = (list || []).find((f) => f.isDefault);
      //   if (def) {
      //     // todo need to add later
      //     //  this.applySavedFilter(def.id);
      //   }
      //   this.hasAppliedDefaultOnInit.set(true);
      // }
      // Apply default saved filter only once when saved filters first load
      this.listenQueryParams();
      // Load fields initially without using effect()
      // this.loadFields(this.appliedFilterId() ?? undefined);
    });
  }

  openAddTicket() {
    this.modalService.show(AddTicketModal, {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-xl',
    });
  }

  /**
   * Maps UI filter params to server request payload.
   * Keeps undefined properties out of the request, mirroring existing logic.
   */
  private mapToProductRequest(params: TicketListFilterParams): TicketRequest {
    const request: TicketRequest = {
      page: params.page,
      pageSize: params.pageSize,
      sort:
        params.sortColumn && params.sortBy !== undefined
          ? `${params.sortColumn}:${params.sortBy === EnumSortBy.ASC ? 'asc' : 'desc'}`
          : undefined,
      search: params.search,
      ticketTypeIds: toNums(params.ticketTypeIds),
      ticketStatusIds: toNums(params.ticketStatusIds),
      // supplierIds: toNums(params.supplierIds),
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      // selectedColumns: params.selectedColumns,
      status: params.status,
    };

    // 🔹 Remove all undefined properties before returning
    Object.keys(request).forEach((key) => {
      const value = (request as unknown as Record<string, unknown>)[key];
      if (value === undefined) {
        delete (request as unknown as Record<string, unknown>)[key];
      }
    });

    return request;
  }
  /**
   * Syncs query params from the URL into component signals and FilterParams store.
   * - Applies defaults (page/status/sort) when missing
   * - Updates local sidebar selections (category/supplier)
   * - Resolves price slot vs custom price mode based on min/max presence and match
   */
  private listenQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((raw) => {
      const params: Record<string, unknown> = { ...raw };

      // Set defaults for missing params
      if (params['search'] || !params['page']) {
        params['page'] = DEFAULT_PAGE;
      }
      // if (!params['status']) {
      //   params['status'] = SettingsStatusEnum.Active;
      // }
      // if (!params['sortColumn']) {
      //   params['sortColumn'] = 'ProductCode';
      // }
      // if (params['sortBy'] === undefined) {
      //   params['sortBy'] = EnumSortBy.DESC;
      // }

      // Sync category selection from URL params
      const ticketTypeIds = toNums(params['ticketTypeIds']) ?? [];
      this.selectedTicketTypeIds.set(ticketTypeIds);
      const ticketStatusIds = toNums(params['ticketStatusIds']) ?? [];
      this.selectedTicketTypeIds.set(ticketStatusIds);

      // Sync supplier selection from URL params
      // const supplierIds = toNums(params['supplierIds']) ?? [];
      // this.selectedSupplierIds.set(supplierIds);

      // // Handle price slot selection logic (accept 0 values)
      // if ('minPrice' in params && 'maxPrice' in params) {
      //   const minNum = Number(params['minPrice']);
      //   const maxNum = Number(params['maxPrice']);

      //   this.minPrice.set(minNum);
      //   this.maxPrice.set(maxNum);

      //   // Check if the price matches any predefined slot
      //   const slots = this.priceSlots();
      //   const matchingSlot = slots.find((slot) => slot.min === minNum && slot.max === maxNum);

      //   // If no matching slot, set custom price mode
      //   this.customPrice.set(!matchingSlot);
      // } else {
      //   // No price filter applied
      //   this.minPrice.set(null);
      //   this.maxPrice.set(null);
      //   this.customPrice.set(false);
      // }

      // Let normalizeValue handle all conversions
      this.filters.setMany(params as Partial<TicketListFilterParams>);
    });
  }
}
