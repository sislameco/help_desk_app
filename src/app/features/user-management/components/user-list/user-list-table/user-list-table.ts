import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UserStatusEnum } from '../../../enums/user-list-enum';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '../../../services/user.service';
import { derivedAsync } from 'ngxtension/derived-async';
import {
  EnumRStatus,
  UserFilterParams,
  UserProfileDto,
  Users,
} from '../../../models/user-list-model';
import { CommonModule } from '@angular/common';
import { CreateEditUser } from '../create-edit-user/create-edit-user';
import { UserRoleService } from '../../../services/user-role.service';
import { FilterParams } from '@shared/helper/classes/filter-params.class';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@shared/const/pagination.const';
import { FormsModule } from '@angular/forms';
import { EnumSortBy } from '@shared/enums/sort-by.enum';
import { toNums } from '@shared/helper/functions/common.function';
import { CommonSelectBox } from '@shared/models/common.model';
import { Pagination } from '@shared/helper/components/pagination/pagination';

@Component({
  selector: 'app-user-list-table',
  imports: [NgSelectModule, BsDropdownModule, CommonModule, FormsModule, Pagination],
  templateUrl: './user-list-table.html',
  styleUrl: './user-list-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService],
  standalone: true,
})
export class UserListTable {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly modalService = inject(BsModalService);
  private readonly userRoleService = inject(UserRoleService);

  // Query param management
  readonly filters = new FilterParams<{
    page: number;
    pageSize: number;
    roleIds?: string;
    status?: number;
    search: string;
  }>({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    status: undefined,
    search: '',
  });
  readonly statusOptions: CommonSelectBox[] = Object.entries(UserStatusEnum)
    .filter(([key]) => isNaN(Number(key))) // keep only string keys
    .map(([label, value]) => ({
      label,
      value: value as unknown as number,
    }));
  // Pagination computed
  readonly totalItems = computed(() => this.filterData()?.total ?? 0);
  readonly pageSize = computed(() => this.filters.value().pageSize);
  readonly currentPage = computed(() => this.filters.value().page);
  readonly lastItemIndex = computed(() => {
    const last = this.currentPage() * this.pageSize();
    return last > this.totalItems() ? this.totalItems() : last;
  });
  // readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()) || 1);
  // readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  filterData: Signal<{ items: Users[]; total: number }> = computed(() => {
    const roleIds: number[] = Array.isArray(this.filters.value().roleIds)
      ? (this.filters.value().roleIds as unknown as number[])
      : [];
    const allItems =
      this.usersResult()?.filter(
        (user) =>
          (roleIds.includes(user.roleId) || roleIds.length === 0) &&
          (user.status === this.filters.value().status! || !this.filters.value().status) &&
          (user.fullName.toLowerCase().includes(this.filters.value().search.toLowerCase()) ||
            user.email.toLowerCase().includes(this.filters.value().search.toLowerCase()) ||
            user.phone.toLowerCase().includes(this.filters.value().search.toLowerCase())),
      ) ?? [];
    // Apply pagination
    const page = this.currentPage();
    const pageSize = this.pageSize();
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pagedItems = allItems.slice(start, end);
    return {
      items: pagedItems,
      total: allItems.length,
    };
  });

  UserStatusEnum = UserStatusEnum;
  enumRStatus = EnumRStatus;
  selectedUser: Users | null = null;
  isViewOpen = false;

  protected readonly usersResult = derivedAsync(() => {
    this.refresh();
    return this.userService.getAll({
      companyId: 1, // or 0 if optional
      roleIds: [],
      departmentIds: [],
      searchText: '',
      status: 1, // EnumRStatus.Active (match backend enum value)
      pageNo: 1,
      itemsPerPage: 20,
    });
  });
  protected readonly roleDropdown = derivedAsync(() => this.userRoleService.getRoleDropdown());
  //userList = signal<UserModel[]>(userList);

  protected readonly refresh = signal(0);
  // allSelected = signal(false);
  // selectedRows = signal<number[]>([]);

  // 👉 Constructor
  constructor() {
    this.listenQueryParams();
  }

  // 👉 Private methods
  private listenQueryParams() {
    this.route.queryParams.subscribe((raw) => {
      const params: Record<string, unknown> = { ...raw };
      // if (params['search'] || !params['page'] || params['status']) {
      //   params['page'] = DEFAULT_PAGE;
      // }
      if (!params['page']) {
        params['page'] = DEFAULT_PAGE;
      }

      // status
      params['status'] = params['status'] ? Number(params['status']) : UserStatusEnum.Active;

      const roleIds = toNums(params['roleIds']);
      const warehouseIds = toNums(params['warehouseIds']);
      if (Array.isArray(roleIds) && roleIds.length > 0) {
        params['roleIds'] = roleIds;
      } else {
        params['roleIds'] = [];
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
      this.filters.setMany(params as Partial<UserFilterParams>);
    });
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

  // onSelectRow(event: Event, index: number) {
  //   const checkbox = event.target as HTMLInputElement;
  //   if (checkbox.checked) {
  //     this.selectedRows.update((rows) => [...rows, index]);
  //   } else {
  //     this.selectedRows.update((rows) => rows.filter((i) => i !== index));
  //     this.allSelected.set(false);
  //   }
  // }

  // onSelectAll(event: Event) {
  //   const checkbox = event.target as HTMLInputElement;
  //   this.allSelected.set(checkbox.checked);
  //   if (this.allSelected()) {
  //     this.selectedRows.set((this.usersResult() ?? []).map((_, i) => i));
  //   } else {
  //     this.selectedRows.set([]);
  //   }
  // }
  // removeAlert() {
  //   const modalConfig = {
  //     backdrop: true,
  //     ignoreBackdropClick: true,
  //   };
  //   const modalParams = Object.assign({}, modalConfig, { class: 'modal-md' });
  //   this.modalService.show(AlertModal, modalParams);
  // }
  reload() {
    this.refresh.update((v: number) => v + 1);
  }
  closeView() {
    this.isViewOpen = false;
    this.selectedUser = null;
  }
  viewUser(user: Users) {
    this.selectedUser = user;
    this.isViewOpen = true; // show popup
  }
  onEdit(sessionId: number) {
    this.router.navigate([sessionId], { relativeTo: this.route });
  }

  updateRoleModal(user: Users) {
    this.createUpdateRoleModal({
      firstName: user.firstName,
      lastName: user.lastname,
      email: user.email,
      phone: user.phone,
      id: user.id,
      roleId: user.roleId,
    });
  }

  createUpdateRoleModal(user?: UserProfileDto) {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: {
        user,
        roles: this.roleDropdown() || [],
      },
    };
    const modalParams = Object.assign({}, modalConfig, { class: 'modal-lg' });
    const modalRef = this.modalService.show(CreateEditUser, modalParams);
    modalRef.content?.formSubmit.subscribe((res) => {
      if (res) {
        this.reload();
      }
    });
  }
}
