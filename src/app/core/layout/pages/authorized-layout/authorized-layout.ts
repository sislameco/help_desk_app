import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthorizedSidebar } from './authorized-sidebar/authorized-sidebar';
import { AuthorizedHeader } from './authorized-header/authorized-header';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-authorized-layout',
  templateUrl: './authorized-layout.html',
  styleUrls: ['./authorized-layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthorizedSidebar, AuthorizedHeader],
})
export class AuthorizedLayout {
  readonly route = inject(ActivatedRoute);

  isIframe = signal<boolean>(false);
  userId = signal<number | null>(null);
  appId = signal<number | null>(null);
  constructor() {
    this.route.queryParams.subscribe((params) => {
      this.userId.set(params['userId'] ? Number(params['userId']) : null);
      this.isIframe.set(params['iframe'] === 'true');
      this.appId.set(params['appId'] ? Number(params['appId']) : null);
    });
  }
}
