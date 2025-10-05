import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { DepartmentSettingService } from '../../../services/department-setting.service';
import {
  DepartmentMenu,
  DepartmentSetupOutputDto,
  DepartmentUpdateDto,
} from '../../../models/department-setting.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnumRStatus } from '../../../../user-management/models/user-list-model';
import { derivedAsync } from 'ngxtension/derived-async';
import { MenuAccess } from '../../../../user-management/models/menu.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-department-setup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-department-setup.html',
  styleUrl: './update-department-setup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateDepartmentSetup {
  bsModalRef = inject(BsModalRef);
  private readonly departmentService = inject(DepartmentSettingService);
  departmentId = 0;
  department = signal<DepartmentSetupOutputDto | null>(null);
  roleMenuActions: DepartmentMenu[] = [];
  private fb = new FormBuilder();
  readonly isSubmitting = signal(false);

  constructor() {
    this.loadDepartment();

    // 👇 Effect that reacts when loadDepartment updates and patches the form
    effect(() => {
      const dep = this.loadDepartment();
      if (dep && dep.id) {
        this.form.patchValue({
          id: dep.id,
          name: dep.name,
          description: dep.description,
          managerId: dep.managerId,
          status: dep.status,
        });
      }
    });
  }

  readonly form = this.fb.group({
    id: [null as number | null],
    name: [{ value: '', disabled: true }],
    description: ['', Validators.required],
    managerId: [null as number | null, Validators.required],
    status: [EnumRStatus.Active, Validators.required],
  });

  readonly loadDepartment = derivedAsync(
    () => this.departmentService.getDepById(this.departmentId),
    {
      initialValue: {
        id: 0,
        name: '',
        description: '',
        managerId: 0,
        status: EnumRStatus.Active,
        menus: [],
      } as DepartmentSetupOutputDto,
    },
  );

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting.set(true);

    const payload: DepartmentUpdateDto = {
      id: this.form.value.id ?? 0,
      //name: this.form.value.name ?? '',
      description: this.form.value.description ?? '',
      managerId: this.form.value.managerId ?? 0,
      status: this.form.value.status ?? EnumRStatus.Active,
      menus: this.roleMenuActions,
    };

    this.departmentService.updateDepartment(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.form.reset();
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  // Helper to check if action is permitted
  togglePermission(menu: MenuAccess, actionId: number) {
    const target = menu.actions.find((a) => a.id === actionId);
    return target ? target.isPermitted : false;
  }

  setPermission(menu: MenuAccess, actionId: number, value: boolean) {
    const target = menu.actions.find((a) => a.id === actionId);
    if (target) {
      target.isPermitted = value;
      this.roleMenuActions.push({
        isAllowed: target.isPermitted,
        fkMenuActionMapId: target.fkMenuActionMapId,
      });
    }
  }
}
