import { ChangeDetectionStrategy, Component } from '@angular/core';

import { inject } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-breadcrumbs',
  imports: [],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcrumbs {
  private readonly location = inject(Location);

  back() {
    this.location.back();
  }
}
