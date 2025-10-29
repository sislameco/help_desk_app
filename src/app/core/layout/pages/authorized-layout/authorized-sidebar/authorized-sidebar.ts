import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CollapseDirective } from 'ngx-bootstrap/collapse';
import { SubMenuu, UserMenuItem } from './sidebar-data-type';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { AuthStore } from '@core/store/auth-store/auth.store';

@Component({
  selector: 'app-authorized-sidebar',
  templateUrl: './authorized-sidebar.html',
  styleUrls: ['./authorized-sidebar.scss'],
  imports: [CollapseDirective, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedSidebar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  menuList = signal<UserMenuItem[]>([]);

  constructor() {
    this.authService.getSidebarItems().subscribe((items: UserMenuItem[]) => {
      this.authStore.updateMenus(items);
      this.menuList.set(items);
    });
  }

  toggleMenu(menu: UserMenuItem) {
    this.menuList.update((list: UserMenuItem[]) =>
      list.map((m: UserMenuItem) => ({
        ...m,
        isOpen: m === menu ? !m.isOpen : false,
      })),
    );
  }
  getCurrentRouteMatch(): UserMenuItem | undefined {
    const currentUrl = this.router.url;
    const items = this.menuList();
    // Check top-level menu
    const match = items.find(
      (item: UserMenuItem) => item.route && currentUrl.startsWith(item.route!),
    );
    if (match) {
      return match;
    }
    // Check subMenus
    for (const item of items) {
      if (item.subMenus) {
        const subMatch = item.subMenus.find(
          (sub: SubMenuu) => sub.route && currentUrl.startsWith(sub.route!),
        );
        if (subMatch) {
          return item;
        }
      }
    }
    return undefined;
  }
}
