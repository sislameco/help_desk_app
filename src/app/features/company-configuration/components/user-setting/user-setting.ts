import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserSettingService } from '../../services/user-setting.service';
import { UserPaginationInputDto, UserSetupOutputDto } from '../../models/user-setting.model';
import { UpdateUserSetting } from './update-user-setting/update-user-setting';
import { EnumRStatus } from '../../../user-management/models/user-list-model';

@Component({
  selector: 'app-user-setting',
  standalone: true,
  imports: [],
  templateUrl: './user-setting.html',
  styleUrl: './user-setting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService],
})
export class UserSetting {
  private readonly userService = inject(UserSettingService);
  private readonly companyId = 1;
  private readonly filter = signal<UserPaginationInputDto>({
    status: EnumRStatus.Active,
    pageNo: 1,
    itemsPerPage: 20,
  });
  modalService = inject(BsModalService);

  readonly users = signal<{
    items: UserSetupOutputDto[];
    total: number;
    page: number;
    pageSize: number;
  }>({ items: [], total: 0, page: 1, pageSize: 10 });

  constructor() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers(this.companyId, this.filter()).subscribe({
      next: (res) => {
        this.users.set(res);
      },
    });
  }

  openUserSetupModal(user: UserSetupOutputDto) {
    // Implement modal logic as needed
    this.modalService.show(UpdateUserSetting, {
      class: 'modal-lg',
      ignoreBackdropClick: true,
      initialState: {
        userId: user.id,
      },
    });
  }
}
