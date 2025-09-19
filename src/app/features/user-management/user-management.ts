import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Breadcrumbs } from '@shared/helper/components/breadcrumbs/breadcrumbs';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-management',
  imports: [Breadcrumbs, RouterOutlet],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagement {}
