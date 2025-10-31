import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterSidebar } from '@shared/helper/components/filter-sidebar/filter-sidebar';
import { derivedAsync } from 'ngxtension/derived-async';
import { map, of, Subject, takeUntil } from 'rxjs';
import { TicketReferenceService } from '../../../../../company-configuration/services/ticket-reference-service';
import { FilterParams } from '@shared/helper/classes/filter-params.class';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@shared/const/pagination.const';
import {
  EnumPriority,
  EnumTicketStatus,
  EnumTimePeriod,
  TicketListFilterParams,
} from '../../../../models/ticket.model.model';
import { createToggleList } from '../../../../helpers/filter-function';
import { toNums } from '@shared/helper/functions/common.function';
import { CommonSelectBoxGeneric } from '@shared/models/common.model';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket-filter',
  imports: [FilterSidebar, BsDatepickerModule, FormsModule],
  templateUrl: './ticket-filter.html',
  styleUrl: './ticket-filter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TicketReferenceService],
})
export class TicketFilter {
  dateTest: Date[] | null = null;
  private readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  private readonly ticketRef = inject(TicketReferenceService);

  private ngUnsubscribe$ = new Subject<void>();

  fkCompanyId = 1;
  // Use ProductListFilterParams for filters/query param management
  readonly filters = new FilterParams<TicketListFilterParams>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  private readonly refresh = signal(0);
  // ─────────────────────────────────────────────────────────────────────────────
  // Price Filter (sidebar)
  // - Predefined ranges generated from 0..5000
  // - Custom range toggled when no predefined slot matches current min/max
  // - Query params keep state in URL
  // ─────────────────────────────────────────────────────────────────────────────
  enumTimePeriod = EnumTimePeriod;
  // startDate: Date | undefined = undefined;
  // endDate: Date | undefined = undefined;
  readonly minDate = signal<Date>(new Date());
  readonly maxDate = signal<Date>(new Date());
  readonly customDate = signal(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // Supplier selection (sidebar)
  // ─────────────────────────────────────────────────────────────────────────────
  selectedSupplierIds = signal<number[]>([]);

  prioritys = signal<CommonSelectBoxGeneric<number>[]>(
    Object.entries(EnumPriority)
      .filter(([key]) => isNaN(Number(key))) // keep only string keys
      .map(([label, value]) => ({
        label,
        value: value as unknown as number,
      })),
  );
  readonly prioritysToggle = createToggleList(this.prioritys, 5);
  selectedPriorityIds = signal<number[]>([]);
  readonly isAllPriorityChecked = computed(() => this.selectedPriorityIds().length === 0);
  allprioritysCount = computed(() => {
    return this.prioritys().length;
  });
  ticketPriorityToggle(id: number, checked: boolean) {
    const current = this.selectedPriorityIds();
    const updated = checked ? [...current, id] : current.filter((sid) => sid !== id);
    this.selectedPriorityIds.set(updated);
    // If none checked, treat as 'All'
    if (updated.length === 0) {
      this.resetTicketPrioritySelection();
    } else {
      this.navigateRoute({ ticketPriorityIds: updated, page: 1 });
    }
    // this.refresh.update((x) => x + 1);
  }

  readonly ticketStatuses = signal<CommonSelectBoxGeneric<number>[]>(
    Object.entries(EnumTicketStatus)
      .filter(([key]) => isNaN(Number(key))) // keep only string keys
      .map(([label, value]) => ({
        label,
        value: value as unknown as number,
      })),
  );
  readonly ticketStatusesToggle = createToggleList(this.ticketStatuses, 5);
  selectedticketStatusIds = signal<number[]>([]);
  readonly isAllticketStatuseChecked = computed(() => this.selectedticketStatusIds().length === 0);
  allticketStatusesCount = computed(() => {
    return this.ticketStatuses().length;
  });
  ticketStatusToggle(id: number, checked: boolean) {
    const current = this.selectedticketStatusIds();
    const updated = checked ? [...current, id] : current.filter((sid) => sid !== id);
    this.selectedticketStatusIds.set(updated);
    // If none checked, treat as 'All'
    if (updated.length === 0) {
      this.resetTicketStatusSelection();
    } else {
      this.navigateRoute({ ticketStatusIds: updated, page: 1 });
    }
    // this.refresh.update((x) => x + 1);
  }

  ticketTypes = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getTicketTypes(this.fkCompanyId)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );
  readonly ticketTypesToggle = createToggleList(this.ticketTypes, 5);
  selectedTicketTypeIds = signal<number[]>([]);
  readonly isAllTicketTypeChecked = computed(() => this.selectedTicketTypeIds().length === 0);
  allTicketTypesCount = computed(() => {
    return this.ticketTypes().length;
  });
  /**
   * Toggles a supplier in the current selection and triggers a refresh.
   * @param id Supplier ID
   * @param checked True when selected, false when removed
   */
  ticketTypeToggle(id: number, checked: boolean) {
    const current = this.selectedTicketTypeIds();
    const updated = checked ? [...current, id] : current.filter((sid) => sid !== id);
    this.selectedTicketTypeIds.set(updated);
    // If none checked, treat as 'All'
    if (updated.length === 0) {
      this.resetTicketTypeSelection();
    } else {
      this.navigateRoute({ ticketTypeIds: updated, page: 1 });
    }
    // this.refresh.update((x) => x + 1);
  }

  timePeriod = signal<number>(0);

  users = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef.getUsers(this.fkCompanyId).pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );
  readonly usersToggle = createToggleList(this.users, 5);
  selectedUserIds = signal<number[]>([]);
  readonly isAllUserChecked = computed(() => this.selectedUserIds().length === 0);
  allusersCount = computed(() => {
    return this.users().length;
  });
  ticketUserToggle(id: number, checked: boolean) {
    const current = this.selectedUserIds();
    const updated = checked ? [...current, id] : current.filter((sid) => sid !== id);
    this.selectedUserIds.set(updated);
    // If none checked, treat as 'All'
    if (updated.length === 0) {
      this.resetUserSelection();
    } else {
      this.navigateRoute({ userIds: updated, page: 1 });
    }
    // this.refresh.update((x) => x + 1);
  }

  constructor() {
    afterNextRender(async () => {
      this.listenQueryParams();
    });
  }

  refreshFilters() {
    this.refresh.update((x) => x + 1);
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
      // Sync category selection from URL params
      const ticketTypeIds = toNums(params['ticketTypeIds']) ?? [];
      this.selectedTicketTypeIds.set(ticketTypeIds);

      const ticketStatusIds = toNums(params['ticketStatusIds']) ?? [];
      this.selectedticketStatusIds.set(ticketStatusIds);

      const ticketPriorityIds = toNums(params['ticketPriorityIds']) ?? [];
      this.selectedPriorityIds.set(ticketPriorityIds);

      const userIds = toNums(params['userIds']) ?? [];
      this.selectedUserIds.set(userIds);

      this.minDate.set(params['minDate'] ? new Date(params['minDate'] as string) : new Date());
      this.maxDate.set(params['maxDate'] ? new Date(params['maxDate'] as string) : new Date());

      const timePeriod = Number(params['timePeriod']) || EnumTimePeriod.ALL;
      this.filters.value().timePeriod = timePeriod;
      this.timePeriod.set(timePeriod);

      this.filters.setMany(params as Partial<TicketListFilterParams>);
    });
  }
  resetToDefault() {
    this.navigateRoute({
      page: 1,
      timePeriod: EnumTimePeriod.ALL,
      ticketTypeIds: [],
      ticketStatusIds: [],
      ticketPriorityIds: [],
      userIds: [],
      minDate: new Date().toISOString(),
      maxDate: new Date().toISOString(),
    });
  }

  // Reset all categories (when "All" is checked)
  resetTicketTypeSelection() {
    this.selectedTicketTypeIds.set([]);
    this.navigateRoute({ ticketTypeIds: [], page: 1 });
    this.refresh.update((x) => x + 1);
  }
  resetTicketStatusSelection() {
    this.selectedticketStatusIds.set([]);
    this.navigateRoute({ ticketStatusIds: [], page: 1 });
    this.refresh.update((x) => x + 1);
  }
  resetTicketPrioritySelection() {
    this.selectedPriorityIds.set([]);
    this.navigateRoute({ ticketPriorityIds: [], page: 1 });
    this.refresh.update((x) => x + 1);
  }
  resetUserSelection() {
    this.selectedUserIds.set([]);
    this.navigateRoute({ userIds: [], page: 1 });
    this.refresh.update((x) => x + 1);
  }

  toggleCustomDate() {
    this.customDate.set(true);
    this.minDate.set(new Date());
    this.maxDate.set(new Date(Date.now() + 5000));
    this.navigateRoute({
      minDate: this.minDate().toISOString(),
      maxDate: this.maxDate().toISOString(),
      page: 1,
    });
  }

  private navigateRoute(changes: Partial<TicketListFilterParams> = {}, isReplace = false) {
    const queryParams = isReplace ? changes : { ...this.filters.value(), ...changes };
    // Remove undefined or null keys (for cleared filters)
    Object.keys(queryParams).forEach((k) => {
      if (queryParams[k] === undefined || queryParams[k] === null) {
        delete queryParams[k];
      }
    });
    this.router
      .navigate([], {
        queryParams,
        queryParamsHandling: isReplace ? 'replace' : 'merge',
      })
      .then();
  }

  setTimeFilter(timePeriod: EnumTimePeriod = EnumTimePeriod.ALL) {
    this.timePeriod.set(timePeriod);
    const { fromDate, toDate } = this.setTimePeriod(timePeriod);
    this.navigateRoute({
      timePeriod,
      minDate: fromDate.toISOString(),
      maxDate: toDate.toISOString(),
      page: 1,
    });
  }

  minDateChange(value: Date | null) {
    this.navigateRoute({
      minDate: value?.toISOString(),
      page: 1,
    });
  }

  maxDateChange(value: Date | null) {
    this.navigateRoute({
      maxDate: value?.toISOString(),
      page: 1,
    });
  }

  setTimePeriod(type: EnumTimePeriod): { fromDate: Date; toDate: Date } {
    const dates = { fromDate: new Date(), toDate: new Date() };
    const now = new Date();

    switch (type) {
      case EnumTimePeriod.ALL:
        return dates;

      case EnumTimePeriod.CurrentMonth: {
        const fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const toDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        dates.fromDate = fromDate;
        dates.toDate = toDate;
        return dates;
      }

      case EnumTimePeriod.PreviousMonth: {
        const fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const toDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
        dates.fromDate = fromDate;
        dates.toDate = toDate;
        return dates;
      }

      case EnumTimePeriod.CurrentYear: {
        const fromDate = new Date(now.getFullYear(), 0, 1);
        const toDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        dates.fromDate = fromDate;
        dates.toDate = toDate;
        return dates;
      }

      case EnumTimePeriod.LastYear: {
        const fromDate = new Date(now.getFullYear() - 1, 0, 1);
        const toDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
        dates.fromDate = fromDate;
        dates.toDate = toDate;
        return dates;
      }

      case EnumTimePeriod.Custom: {
        dates.fromDate = new Date();
        dates.toDate = new Date();
        return dates;
      }
    }
  }
}
