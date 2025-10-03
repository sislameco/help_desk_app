import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { derivedAsync } from 'ngxtension/derived-async';
import { DepartmentSettingService } from '../../services/department-setting.service';
import { DepartmentSettingInputDto } from '../../models/department-setting.model';
import { EnumToStringPipe } from '@shared/helper/pipes/pipes/enum-to-string-pipe';

@Component({
  selector: 'app-department-setting',
  imports: [EnumToStringPipe],
  templateUrl: './department-setting.html',
  styleUrl: './department-setting.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentSetting {
  private readonly departmentService = inject(DepartmentSettingService);
  private readonly companyId = 1; // TODO: get from route or context
  private readonly filter = signal<DepartmentSettingInputDto>({});

  readonly departments = derivedAsync(
    () => this.departmentService.getAllDepartments(this.companyId, this.filter()),
    {
      initialValue: {
        items: [],
        total: 0,
        page: 1,
        pageSize: 10,
      },
    },
  );
}
