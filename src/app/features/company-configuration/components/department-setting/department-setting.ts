import { BsModalService } from 'ngx-bootstrap/modal';
import { EnumRStatus } from '../../../user-management/models/user-list-model';
import {
  DepartmentSettingInputDto,
  DepartmentSettingOutputDto,
} from '../../models/department-setting.model';
import { DepartmentSettingService } from '../../services/department-setting.service';
import { UpdateDepartmentSetup } from './update-department-setup/update-department-setup';
import { derivedAsync } from 'ngxtension/derived-async';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

@Component({
  selector: 'app-department-setting',
  standalone: true,
  imports: [], // ❌ no need UpdateDepartmentSetup here
  templateUrl: './department-setting.html',
  styleUrl: './department-setting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService],
})
export class DepartmentSetting {
  private readonly departmentService = inject(DepartmentSettingService);
  private readonly companyId = 1;
  private readonly filter = signal<DepartmentSettingInputDto>({});
  enumRStatus: typeof EnumRStatus = EnumRStatus;
  modalService = inject(BsModalService);

  readonly departments = derivedAsync(
    () => this.departmentService.getAllDepartments(this.companyId, this.filter()),
    {
      initialValue: { items: [], total: 0, page: 1, pageSize: 10 },
    },
  );

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
