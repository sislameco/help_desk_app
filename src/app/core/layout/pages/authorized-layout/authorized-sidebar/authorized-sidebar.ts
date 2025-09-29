import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CollapseDirective } from 'ngx-bootstrap/collapse';
import { UserMenuItem } from './sidebar-data-type';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';

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

  menuList = signal<UserMenuItem[]>([]);

  constructor() {
    this.authService.getSidebarItems().subscribe((items: UserMenuItem[]) => {
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
}
