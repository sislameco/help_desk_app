import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CollapseDirective } from 'ngx-bootstrap/collapse';
import { MenuItem } from './sidebar-data-type';
import { MENUS } from './sidebar-data';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-authorized-sidebar',
  templateUrl: './authorized-sidebar.html',
  styleUrls: ['./authorized-sidebar.scss'],
  imports: [CollapseDirective, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedSidebar {
  menuList = signal<MenuItem[]>(MENUS);
  private router = inject(Router);

  toggleMenu(menu: MenuItem) {
    this.menuList().forEach((m) => (m.isOpen = m === menu ? !m.isOpen : false));
  }

  // isActive(link?: string): boolean {
  //   if (!link || link === '#') return false;
  //   return this.router.isActive(link, {
  //     paths: 'subset',
  //     queryParams: 'ignored',
  //     fragment: 'ignored',
  //     matrixParams: 'ignored',
  //   });
  // }
}
