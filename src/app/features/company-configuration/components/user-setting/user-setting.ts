import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserSettingService } from '../../services/user-setting.service';
import { UserFilterParams, UserSetupOutputDto } from '../../models/user-setting.model';
import { UpdateUserSetting } from './update-user-setting/update-user-setting';
import { FilterParams } from '@shared/helper/classes/filter-params.class';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@shared/const/pagination.const';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { UserStatusEnum } from '../../../user-management/enums/user-list-enum';
import { toNums } from '@shared/helper/functions/common.function';
import { EnumSortBy } from '@shared/enums/sort-by.enum';
import { SortAction } from '@shared/helper/directives/sort-table/sort-table.model';
import { derivedAsync } from 'ngxtension/derived-async';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { Pagination } from '@shared/helper/components/pagination/pagination';
import { FormsModule } from '@angular/forms';
import { Search } from '@shared/helper/components/search/search';
import { SortTableDirective } from '@shared/helper/directives/sort-table/sort-table.directive';
import { SortInputDirective } from '@shared/helper/directives/sort-table/sort-input.directive';
import { DepartmentSettingService } from '../../services/department-setting.service';

@Component({
  selector: 'app-user-setting',
  standalone: true,
  imports: [
    BsDropdownModule,
    NgSelectModule,
    Pagination,
    FormsModule,
    Search,
    SortTableDirective,
    SortInputDirective,
  ],
  templateUrl: './user-setting.html',
  styleUrl: './user-setting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService, DepartmentSettingService],
})
export class UserSetting {
  private readonly userService = inject(UserSettingService);
  modalService = inject(BsModalService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly departmentService = inject(DepartmentSettingService);

  // Query param management
  readonly filters = new FilterParams<UserFilterParams>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  private readonly refresh = signal(0);

  readonly totalItems = computed(() => this.users()?.total ?? 0);
  readonly pageSize = computed(() => this.filters.value().pageSize);
  readonly currentPage = computed(() => this.filters.value().page);
  readonly lastItemIndex = computed(() => {
    const last = this.currentPage() * this.pageSize();
    return last > this.totalItems() ? this.totalItems() : last;
  });
  readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()) || 1);
  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  // Use signal to get companyId from route params
  readonly companyId = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : null;
  });
  readonly isShowStatusBar = signal(false);
  readonly users = derivedAsync(
    () => {
      const companyId = this.companyId();
      if (!companyId) {
        return { items: [], total: 0, page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE };
      }
      this.refresh();
      return this.userService.getAllUsers(this.companyId() ?? 0, this.filters.value());
    },
    {
      initialValue: {
        items: [] as UserSetupOutputDto[],
        total: 0,
        page: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
    },
  );

  readonly departmentDropdown = derivedAsync(
    () => this.departmentService.getDepartmentDropdown(this.companyId() ?? 0),
    {
      initialValue: [] as { id: number; fullName: string }[],
    },
  );

  readonly userStatistics = derivedAsync(
    () => {
      const companyId = this.companyId();
      if (!companyId) {
        // Return undefined so derivedAsync will use initialValue
        return undefined;
      }
      this.refresh();
      return this.userService.getUserStatistics(companyId, this.filters.value());
    },
    {
      initialValue: {
        totalUsers: 0,
        activeUsers: 0,
        admins: 0,
        departments: 0,
      },
    },
  );
  constructor() {
    this.listenQueryParams();
  }
  reload() {
    this.refresh.update((v: number) => v + 1);
  }
  openUserSetupModal(user: UserSetupOutputDto) {
    // Implement modal logic as needed
    const modalRef = this.modalService.show(UpdateUserSetting, {
      class: 'modal-lg',
      ignoreBackdropClick: true,
      initialState: {
        user,
        departments: this.departmentDropdown(),
      },
    });
    modalRef.content?.formSubmit.subscribe((res) => {
      if (res) {
        this.reload();
      }
    });
  }

  sortData(action: SortAction) {
    this.navigateRoute({
      sortBy: action.isAscending ? EnumSortBy.ASC : EnumSortBy.DESC,
      page: 1,
      sortColumn: action.key,
    });
  }

  /**
   * Handles changes for multi-select ng-selects (roleIds, warehouseIds).
   * Updates the filter and resets the page. If cleared, sets the filter key to an empty array.
   */
  onMultiChange<K extends keyof UserFilterParams>(key: K, values: number[] | undefined): void {
    const update: Partial<UserFilterParams> = { page: DEFAULT_PAGE };
    if (Array.isArray(values) && values.length > 0) {
      update[key] = values;
    } else {
      // If cleared, set the key to an empty array (for multi-selects)
      update[key] = [] as UserFilterParams[K];
    }
    this.navigateRoute(update, false);
  }

  onStatusChange(value: number) {
    this.navigateRoute({ status: value, page: DEFAULT_PAGE });
  }
  setPage(page: number) {
    this.navigateRoute({ page });
  }
  setPageSize(size: number) {
    this.navigateRoute({ pageSize: size });
  }
  // 👉 Private methods
  private listenQueryParams() {
    this.route.queryParams.subscribe((raw) => {
      const params: Record<string, unknown> = { ...raw };
      if (!params['page']) {
        params['page'] = DEFAULT_PAGE;
      }
      if (!params['search']) {
        params['search'] = '';
      }

      // status
      params['status'] = params['status'] ? Number(params['status']) : UserStatusEnum.Active;

      const departmentIds = toNums(params['departmentIds']);
      if (Array.isArray(departmentIds) && departmentIds.length > 0) {
        params['departmentIds'] = departmentIds;
      } else {
        params['departmentIds'] = [];
      }
      // const moduleIds = toNums(params['moduleIds']);
      // if (Array.isArray(moduleIds) && moduleIds.length > 0) {
      //   params['moduleIds'] = moduleIds;
      // } else {
      //   params['moduleIds'] = [];
      // }
      // if (Array.isArray(warehouseIds) && warehouseIds.length > 0) {
      //   params['warehouseIds'] = warehouseIds;
      // } else {
      //   params['warehouseIds'] = [];
      // }

      if (!params['sortColumn']) {
        params['sortColumn'] = 'fullName';
      }
      params['sortBy'] = params['sortBy'] ? Number(params['sortBy']) : EnumSortBy.ASC;
      this.filters.setMany(params as Partial<UserFilterParams>);
    });
  }

  /**
   * Updates the URL query params with the provided filter changes.
   * Does NOT set filters directly; filters are set only from query params subscription.
   * @param changes Partial filter params to update in the URL
   * @param isReplace If true, replaces query params; otherwise merges
   */
  private navigateRoute(changes: Partial<UserFilterParams> = {}, isReplace = false) {
    const queryParams = isReplace ? changes : { ...this.filters.value(), ...changes };
    // Remove undefined keys (for cleared filters)
    Object.keys(queryParams).forEach((k) => {
      if (queryParams[k] === undefined) {
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

  searchAction(search: string) {
    const extras: NavigationExtras = {
      queryParams: { search },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    };
    this.router.navigate([], extras).then();
  }
}
