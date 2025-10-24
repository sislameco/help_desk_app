import { ChangeDetectionStrategy, Component } from '@angular/core';

import { inject } from '@angular/core';
import { Location } from '@angular/common';
import { Search } from '../search/search';
import { NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'app-breadcrumbs',
  imports: [Search],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumbs {
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  back() {
    this.location.back();
  }
  searchAction(search: string) {
    const extras: NavigationExtras = {
      queryParams: { search },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    };
    this.router.navigate([], extras).then();
  }
}
