import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthorizedSidebar } from './authorized-sidebar/authorized-sidebar';
import { AuthorizedHeader } from './authorized-header/authorized-header';

@Component({
  selector: 'app-authorized-layout',
  templateUrl: './authorized-layout.html',
  styleUrls: ['./authorized-layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthorizedSidebar, AuthorizedHeader],
})
export class AuthorizedLayout {}
