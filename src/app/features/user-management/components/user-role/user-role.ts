import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserRoleService } from '../../services/user-role.service';
import { RoleFilterParams, RoleTypeEnum, RStatusEnum } from '../../models/role.model';
import { FilterParams } from '@shared/helper/classes/filter-params.class';
import { derivedAsync } from 'ngxtension/derived-async';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SortTableDirective } from '@shared/helper/directives/sort-table/sort-table.directive';
import { SortInputDirective } from '@shared/helper/directives/sort-table/sort-input.directive';
import { EnumSortBy } from '@shared/enums/sort-by.enum';
import { SortAction } from '@shared/helper/directives/sort-table/sort-table.model';
import { CreateUserRoleModal } from './create-user-role-modal/create-user-role-modal';

@Component({
  selector: 'app-user-role-management',
  imports: [NgSelectModule, BsDropdownModule, FormsModule, SortTableDirective, SortInputDirective],
  templateUrl: './user-role.html',
  styleUrl: './user-role.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService],
})
export class UserRole {
  private userRoleService = inject(UserRoleService);
  readonly modalService = inject(BsModalService);
  protected readonly EnumSortBy = EnumSortBy;
  route = inject(ActivatedRoute);
  readonly filters = new FilterParams<RoleFilterParams>({
    page: 1,
    pageSize: 20,
    search: undefined,
    sort: undefined,
    status: undefined,
    type: undefined,
    isCommissionRole: undefined,
  });

  readonly rolesResult = derivedAsync(
    () => {
      const params = this.filters.toQueryParams();
      return this.userRoleService.list(params);
    },
    {
      initialValue: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 20,
      },
    },
  );

  readonly roles = computed(() => this.rolesResult()?.items ?? []);
  readonly totalCount = computed(() => this.rolesResult()?.total ?? 0);
  readonly page = computed(() => this.filters.value().page);
  readonly pageSize = computed(() => this.filters.value().pageSize);
  readonly totalPages = computed(() => Math.ceil(this.totalCount() / this.pageSize()) || 1);
  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));
  readonly lastItemIndex = computed(() => {
    const last = this.page() * this.pageSize();
    return last > this.totalCount() ? this.totalCount() : last;
  });

  readonly statusOptions = [
    { label: 'Active', value: RStatusEnum.Active },
    { label: 'Inactive', value: RStatusEnum.Inactive },
    { label: 'Deleted', value: RStatusEnum.Deleted },
  ];
  readonly typeOptions = [
    { label: 'System', value: RoleTypeEnum.System },
    { label: 'Custom', value: RoleTypeEnum.Custom },
  ];
  readonly commissionOptions = [
    { label: 'All', value: undefined },
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  getStatusLabel(status: RStatusEnum | undefined): string {
    return this.statusOptions.find((s) => s.value === status)?.label ?? '';
  }
  getTypeLabel(type: RoleTypeEnum | undefined): string {
    return this.typeOptions.find((t) => t.value === type)?.label ?? '';
  }

  setPage(page: number) {
    this.filters.set('page', page);
  }
  setPageSize(size: number) {
    this.filters.set('pageSize', size);
  }
  setSearch(search: string) {
    this.filters.set('search', search);
    this.setPage(1);
  }
  setSort(sort?: string) {
    this.filters.set('sort', sort);
  }
  setStatus(status: RStatusEnum) {
    this.filters.set('status', status);
    this.setPage(1);
  }
  setType(type: RoleTypeEnum) {
    this.filters.set('type', type);
    this.setPage(1);
  }
  setIsCommissionRole(val: boolean) {
    this.filters.set('isCommissionRole', val);
    this.setPage(1);
  }

  createRoleModal() {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
    };
    const modalParams = Object.assign({}, modalConfig, { class: 'modal-lg' });
    this.modalService.show(CreateUserRoleModal, modalParams);
  }

  sortData(action: SortAction) {
    this.filters.set('sortBy', action.isAscending ? EnumSortBy.ASC : EnumSortBy.DESC);
    this.filters.set('page', 1);
    this.filters.set('sortColumn', action.key);
  }
}
