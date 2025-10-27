import { BsModalService } from 'ngx-bootstrap/modal';
import { EnumRStatus } from '../../../user-management/models/user-list-model';
import {
  DepartmentSettingInputDto,
  DepartmentSettingOutputDto,
} from '../../models/department-setting.model';
import { DepartmentSettingService } from '../../services/department-setting.service';
import { UpdateDepartmentSetup } from './update-department-setup/update-department-setup';
import { derivedAsync } from 'ngxtension/derived-async';
import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UserService } from '../../../user-management/services/user.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Pagination } from '@shared/helper/components/pagination/pagination';

@Component({
  selector: 'app-department-setting',
  standalone: true,
  imports: [BsDropdownModule, NgSelectModule, Pagination], // ❌ no need UpdateDepartmentSetup here
  templateUrl: './department-setting.html',
  styleUrl: './department-setting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService],
})
export class DepartmentSetting {
  private readonly departmentService = inject(DepartmentSettingService);
  modalService = inject(BsModalService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  // Query param management
  // readonly filters = new FilterParams<UserFilterParams>({
  //   page: DEFAULT_PAGE,
  //   pageSize: DEFAULT_PAGE_SIZE,
  // });
  private readonly refresh = signal(0);

  // Pagination computed
  // readonly totalItems = computed(() => this.usersResult()?.total ?? 0);
  // readonly pageSize = computed(() => this.filters.value().pageSize);
  // readonly currentPage = computed(() => this.filters.value().page);
  // readonly lastItemIndex = computed(() => {
  //   const last = this.currentPage() * this.pageSize();
  //   return last > this.totalItems() ? this.totalItems() : last;
  // });
  // readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()) || 1);
  // readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  // Use signal to get companyId from route params
  readonly companyId = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? +id : null;
  });
  private readonly filter = signal<DepartmentSettingInputDto>({});
  enumRStatus: typeof EnumRStatus = EnumRStatus;

  readonly isShowStatusBar = signal(false);

  readonly departments = derivedAsync(
    () => {
      const companyId = this.companyId();
      if (!companyId) {
        return { items: [], total: 0, page: 1, pageSize: 10 };
      }
      return this.departmentService.getAllDepartments(companyId, this.filter());
    },
    {
      initialValue: { items: [] as DepartmentSettingOutputDto[], total: 0, page: 1, pageSize: 10 },
    },
  );

  readonly departmentStatistics = derivedAsync(() =>
    this.departmentService.getDepartmentStatistics(),
  );

  readonly userDropdown = derivedAsync(() => {
    const companyId = this.companyId();
    if (!companyId) {
      return [];
    }
    return this.userService.getUserDropdown(companyId);
  });

  openDepSetupModal(department: DepartmentSettingOutputDto) {
    this.modalService.show(UpdateDepartmentSetup, {
      class: 'modal-lg',
      ignoreBackdropClick: true,
      initialState: {
        departmentId: department.id, // ✅ pass data like this
      },
    });
  }

  deleteDepartment(departmentId: number) {
    return departmentId;
  }
}
