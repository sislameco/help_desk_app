import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CollapseDirective } from 'ngx-bootstrap/collapse';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RoleMenuUpsert } from '../../../models/role.model';
import { derivedAsync } from 'ngxtension/derived-async';
import { MenuService } from '../../../services/menu.service';
import { UserRoleService } from '../../../services/user-role.service';
import { NgxControlError } from 'ngxtension/control-error';
import { MenuItem } from '../../../models/menu.model';

@Component({
  selector: 'app-create-user-role-modal',
  imports: [NgSelectModule, CollapseDirective, NgxControlError, ReactiveFormsModule, FormsModule],
  templateUrl: './create-user-role-modal.html',
  styleUrl: './create-user-role-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserRoleModal {
  bsModalRef = inject(BsModalRef);
  private menuService = inject(MenuService);
  private userRoleService = inject(UserRoleService);
  private fb = new FormBuilder();

  // Reactive form
  readonly form: FormGroup<{
    roleName: FormControl<string>;
    description: FormControl<string>;
    isCommissionRole: FormControl<boolean>;
    commissionItemId: FormControl<number | null>;
  }> = this.fb.group({
    roleName: this.fb.nonNullable.control('', [Validators.required]),
    description: this.fb.nonNullable.control('', [Validators.required]),
    isCommissionRole: this.fb.nonNullable.control(false),
    commissionItemId: this.fb.control<number | null>(null),
  });

  // Menu tree from API
  readonly menus = derivedAsync(
    () => {
      const params = { userId: 18 };
      return this.menuService.menuPermitted(params);
    },
    { initialValue: [] as MenuItem[] },
  );

  // Permissions selection state (menuId -> selected action keyEnums[])
  readonly selectedPermissions = signal<Record<number, number[]>>({});

  // Collapsed state for menu nodes (menuId -> collapsed)
  readonly collapsedMap = signal<Record<number, boolean>>({});

  // Loading state
  readonly isSubmitting = signal(false);

  // Toggle collapse for menu tree nodes
  toggle(menuId: number) {
    this.collapsedMap.update((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  }

  // Handle permission selection (menuId, actionKeyEnum)
  selectPermission(menuId: number, actionKeyEnum: number, checked: boolean) {
    this.selectedPermissions.update((prev) => {
      const actions = prev[menuId] ?? [];
      return {
        ...prev,
        [menuId]: checked
          ? [...actions, actionKeyEnum]
          : actions.filter((a) => a !== actionKeyEnum),
      };
    });
  }

  // Extract last-level permissions for API payload
  private extractLastLevelPermissions(menuTree: MenuItem[]): RoleMenuUpsert[] {
    const selected = this.selectedPermissions();

    const walk = (nodes: MenuItem[]): RoleMenuUpsert[] =>
      nodes
        .map((node): RoleMenuUpsert | null => {
          const children = node.children?.length ? walk(node.children) : [];
          const selectedActions: number[] = selected[node.id] ?? [];

          if (selectedActions.length || children.length) {
            return {
              id: node.id,
              actions: selectedActions,
              children,
            };
          }
          return null;
        })
        .filter((n): n is RoleMenuUpsert => n !== null);

    return walk(menuTree);
  }

  // Submit handler
  submit() {
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting.set(true);
    // const menus = this.extractLastLevelPermissions(this.menus() ?? []);
    // const req: RoleUpsertRequest = {
    //   roleId: null,
    //   roleName: this.form.controls.roleName.value,
    //   description: this.form.controls.description.value,
    //   isCommissionRole: this.form.controls.isCommissionRole.value,
    //   commissionItemId: this.form.controls.commissionItemId.value,
    //   menus,
    // };
    // this.userRoleService.roleUpsert(req).subscribe({
    //   next: () => {
    //     this.isSubmitting.set(false);
    //     this.bsModalRef.hide();
    //   },
    //   error: () => this.isSubmitting.set(false),
    // });
  }
}
