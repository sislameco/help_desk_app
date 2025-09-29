import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
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
import { RoleInput, RoleMenuAction, RoleMenuUpsert } from '../../../models/role.model';
import { derivedAsync } from 'ngxtension/derived-async';
import { MenuService } from '../../../services/menu.service';
import { UserRoleService } from '../../../services/user-role.service';
import { NgxControlError } from 'ngxtension/control-error';
import { MenuAccess, MenuItem, MenuResource } from '../../../models/menu.model';

@Component({
  selector: 'app-create-user-role-modal',
  imports: [NgSelectModule, CollapseDirective, NgxControlError, ReactiveFormsModule, FormsModule],
  templateUrl: './create-user-role-modal.html',
  styleUrl: './create-user-role-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserRoleModal {
  constructor() {
    effect(() => {
      if (this.roleId > 0) {
        this.syncFormWithMenuResource();
      }
    });
  }
  roleId: number | 0 = 0;
  bsModalRef = inject(BsModalRef);
  private menuService = inject(MenuService);
  private userRoleService = inject(UserRoleService);
  private fb = new FormBuilder();
  roleMenuActions: RoleMenuAction[] = [];
  // Reactive form
  readonly form: FormGroup<{
    roleName: FormControl<string>;
    description: FormControl<string>;
  }> = this.fb.group({
    roleName: this.fb.nonNullable.control('', [Validators.required]),
    description: this.fb.nonNullable.control('', [Validators.required]),
  });
  // Menu tree from API
  readonly menuResource = derivedAsync(() => this.menuService.menuPermitted(this.roleId), {
    initialValue: { role: { name: '', description: '' }, actions: [], menus: [] } as MenuResource,
  });

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
  getActionPermission(child: MenuAccess, actionId: number) {
    return child.actions.find((a) => a.id === actionId);
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
  // ✅ Submit handler
  submit() {
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting.set(true);

    const payload: RoleInput = {
      name: this.form.value.roleName ?? '',
      description: this.form.value.description ?? '',
      fkMenuActionIds: this.roleMenuActions,
    };
    if (this.roleId && this.roleId > 0) {
      this.userRoleService.updateRole(this.roleId, payload).subscribe({
        next: () => {
          console.log('✅ Role updated successfully');
          this.isSubmitting.set(false);
          this.form.reset();
        },
        error: (err) => {
          console.error('❌ Error updating role:', err);
          this.isSubmitting.set(false);
        },
      });
    } else {
      this.userRoleService.createRole(payload).subscribe({
        next: () => {
          console.log('✅ Role created successfully');
          this.isSubmitting.set(false);
          this.form.reset();
          this.roleMenuActions = [];
        },
        error: (err) => {
          console.error('❌ Error creating role:', err);
          this.isSubmitting.set(false);
        },
      });
    }
  }
  // Sync form and permissions when editing existing role
  syncFormWithMenuResource() {
    const resource = this.menuResource();
    if (resource) {
      // Update form fields
      this.form.patchValue({
        roleName: resource.role.name,
        description: resource.role.description,
      });
    }
  }
}
