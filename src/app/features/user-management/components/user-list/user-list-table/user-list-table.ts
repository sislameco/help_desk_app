import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertModal } from '@shared/helper/components/alert-modal/alert-modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UserStatusEnum } from '../../../enums/user-list-enum';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '../../../services/user.service';
import { derivedAsync } from 'ngxtension/derived-async';
import { EnumRStatus, UserProfileDto, Users } from '../../../models/user-list-model';
import { CommonModule } from '@angular/common';
import { CreateEditUser } from '../create-edit-user/create-edit-user';
import { UserRoleService } from '../../../services/user-role.service';

@Component({
  selector: 'app-user-list-table',
  imports: [NgSelectModule, BsDropdownModule, CommonModule],
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

  UserStatusEnum = UserStatusEnum;
  enumRStatus = EnumRStatus;
  selectedUser: Users | null = null;
  isViewOpen = false;
  // Query param management
  // readonly filters = new FilterParams<UserFilterParams>({
  //   page: DEFAULT_PAGE,
  //   pageSize: DEFAULT_PAGE_SIZE,
  // });
  // private readonly refresh = signal(0);
  // // API data
  // readonly usersResult = derivedAsync(
  //   () => {
  //     this.refresh();
  //     return this.userService.list(this.filters.value());
  //   },
  //   {
  //     initialValue: {
  //       items: [],
  //       total: 0,
  //       page: DEFAULT_PAGE,
  //       pageSize: DEFAULT_PAGE_SIZE,
  //     },
  //   },
  // );
  protected readonly userList = derivedAsync(() => {
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
  allSelected = signal(false);
  selectedRows = signal<number[]>([]);

  // list(data: Params) {
  //   const page = Number(data['page'] ?? 1);
  //   const pageSize = Number(data['pageSize'] ?? 10);
  //   const search = (data['search'] as string) ?? '';
  //   const sortColumn = (data['sortColumn'] as string) ?? 'name';
  //   const sortBy = Number(data['sortBy'] ?? EnumSortBy.ASC);
  //   const roleIds = (data['roleIds'] as number[] | undefined) ?? [];
  //   const warehouseIds = (data['warehouseIds'] as number[] | undefined) ?? [];
  //   const body = {
  //     requestDto: {
  //       page,
  //       pageSize,
  //       search,
  //       roleIds,
  //       warehouseIds,
  //       status: (data['status'] as number) ?? undefined,
  //       sortBy: sortColumn,
  //       desc: sortBy === EnumSortBy.DESC,
  //     },
  //   };
  //   return this.http.post<PaginationResponse<UserList>>(
  //     `${environment.userManagementBaseUrl}/users/paged`,
  //     body,
  //   );
  // }

  onSelectRow(event: Event, index: number) {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedRows.update((rows) => [...rows, index]);
    } else {
      this.selectedRows.update((rows) => rows.filter((i) => i !== index));
      this.allSelected.set(false);
    }
  }

  onSelectAll(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.allSelected.set(checkbox.checked);
    if (this.allSelected()) {
      this.selectedRows.set((this.userList() ?? []).map((_, i) => i));
    } else {
      this.selectedRows.set([]);
    }
  }
  removeAlert() {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
    };
    const modalParams = Object.assign({}, modalConfig, { class: 'modal-md' });
    this.modalService.show(AlertModal, modalParams);
  }
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
