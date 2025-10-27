import { BsModalService } from 'ngx-bootstrap/modal';
import { EnumRStatus } from '../../../user-management/models/user-list-model';
import {
  DepartmentFilterParams,
  DepartmentSettingOutputDto,
} from '../../models/department-setting.model';
import { DepartmentSettingService } from '../../services/department-setting.service';
import { UpdateDepartmentSetup } from './update-department-setup/update-department-setup';
import { derivedAsync } from 'ngxtension/derived-async';
import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UserService } from '../../../user-management/services/user.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Pagination } from '@shared/helper/components/pagination/pagination';
import { FilterParams } from '@shared/helper/classes/filter-params.class';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@shared/const/pagination.const';
import { UserStatusEnum } from '../../../user-management/enums/user-list-enum';
import { toNums } from '@shared/helper/functions/common.function';
import { EnumSortBy } from '@shared/enums/sort-by.enum';
import { SortAction } from '@shared/helper/directives/sort-table/sort-table.model';
import { CommonSelectBox } from '@shared/models/common.model';
import { FormsModule } from '@angular/forms';
import { Search } from '@shared/helper/components/search/search';
import { SortTableDirective } from '@shared/helper/directives/sort-table/sort-table.directive';
import { SortInputDirective } from '@shared/helper/directives/sort-table/sort-input.directive';

@Component({
  selector: 'app-department-setting',
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
  templateUrl: './department-setting.html',
  styleUrl: './department-setting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService, DepartmentSettingService],
})
export class DepartmentSetting {
  private readonly departmentService = inject(DepartmentSettingService);
  modalService = inject(BsModalService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Query param management
  readonly filters = new FilterParams<DepartmentFilterParams>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  private readonly refresh = signal(0);

  readonly statusOptions: CommonSelectBox[] = Object.entries(UserStatusEnum)
    .filter(([key]) => isNaN(Number(key))) // keep only string keys
    .map(([label, value]) => ({
      label,
      value: value as number,
    }));
  // Pagination computed
  readonly totalItems = computed(() => this.departments()?.total ?? 0);
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
  // private readonly filter = signal<DepartmentSettingInputDto>({});
  enumRStatus: typeof EnumRStatus = EnumRStatus;

  readonly isShowStatusBar = signal(false);

  readonly departments = derivedAsync(
    () => {
      const companyId = this.companyId();
      if (!companyId) {
        return { items: [], total: 0, page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE };
      }
      this.refresh();
      return this.departmentService.getAllDepartments(companyId, this.filters.value());
    },
    {
      initialValue: {
        items: [] as DepartmentSettingOutputDto[],
        total: 0,
        page: DEFAULT_PAGE,
        pageSize: DEFAULT_PAGE_SIZE,
      },
    },
  );

  readonly departmentStatistics = derivedAsync(
    () => {
      const companyId = this.companyId();
      if (!companyId) {
        // Return undefined so derivedAsync will use initialValue
        return undefined;
      }
      this.refresh();
      return this.departmentService.getDepartmentStatistics(companyId, this.filters.value());
    },
    {
      initialValue: {
        total: 0,
        active: 0,
        totalUser: 0,
        avgPerDept: 0,
      },
    },
  );

  readonly modules = derivedAsync(() => this.departmentService.getModuleDropdown());

  readonly userDropdown = derivedAsync(() => {
    const companyId = this.companyId();
    if (!companyId) {
      return [];
    }
    return this.userService.getUserDropdown(companyId);
  });

  // 👉 Constructor
  constructor() {
    this.listenQueryParams();
  }

  openDepSetupModal(department: DepartmentSettingOutputDto) {
    this.modalService.show(UpdateDepartmentSetup, {
      class: 'modal-lg',
      ignoreBackdropClick: true,
      initialState: {
        departmentId: department.id, // ✅ pass data like this
        fkCompanyId: this.companyId() as number,
      },
    });
  }

  deleteDepartment(departmentId: number) {
    return departmentId;
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
  onMultiChange<K extends keyof DepartmentFilterParams>(
    key: K,
    values: number[] | undefined,
  ): void {
    const update: Partial<DepartmentFilterParams> = { page: DEFAULT_PAGE };
    if (Array.isArray(values) && values.length > 0) {
      update[key] = values;
    } else {
      // If cleared, set the key to an empty array (for multi-selects)
      update[key] = [] as DepartmentFilterParams[K];
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

      const userIds = toNums(params['userIds']);
      const warehouseIds = toNums(params['warehouseIds']);
      if (Array.isArray(userIds) && userIds.length > 0) {
        params['userIds'] = userIds;
      } else {
        params['userIds'] = [];
      }
      const moduleIds = toNums(params['moduleIds']);
      if (Array.isArray(moduleIds) && moduleIds.length > 0) {
        params['moduleIds'] = moduleIds;
      } else {
        params['moduleIds'] = [];
      }
      if (Array.isArray(warehouseIds) && warehouseIds.length > 0) {
        params['warehouseIds'] = warehouseIds;
      } else {
        params['warehouseIds'] = [];
      }

      if (!params['sortColumn']) {
        params['sortColumn'] = 'name';
      }
      params['sortBy'] = params['sortBy'] ? Number(params['sortBy']) : EnumSortBy.ASC;
      this.filters.setMany(params as Partial<DepartmentFilterParams>);
      console.log('Params updated:', this.filters.value());
    });
  }

  /**
   * Updates the URL query params with the provided filter changes.
   * Does NOT set filters directly; filters are set only from query params subscription.
   * @param changes Partial filter params to update in the URL
   * @param isReplace If true, replaces query params; otherwise merges
   */
  private navigateRoute(changes: Partial<DepartmentFilterParams> = {}, isReplace = false) {
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
