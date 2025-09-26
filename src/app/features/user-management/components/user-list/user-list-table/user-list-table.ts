import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { AlertModal } from '@shared/helper/components/alert-modal/alert-modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UserStatusEnum } from '../../../enums/user-list-enum';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '../../../services/user.service';
import { derivedAsync } from 'ngxtension/derived-async';
import { EnumRStatus, Users } from '../../../models/user-list-model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list-table',
  imports: [NgSelectModule, BsDropdownModule, RouterLink, CommonModule],
  templateUrl: './user-list-table.html',
  styleUrl: './user-list-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService],
  standalone: true,
})
export class UserListTable {
  UserStatusEnum = UserStatusEnum;
  EnumRStatus = EnumRStatus;
  protected readonly refresh = signal(0);
  private readonly userService = inject(UserService);
  selectedUser: Users | null = null;
  isViewOpen = false;
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
  //userList = signal<UserModel[]>(userList);
  allSelected = signal(false);
  selectedRows = signal<number[]>([]);
  modalService = inject(BsModalService);
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
}
