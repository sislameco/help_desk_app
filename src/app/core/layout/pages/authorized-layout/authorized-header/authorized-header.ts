import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthStore } from '@core/store/auth-store/auth.store';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AuthService } from '@core/auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-authorized-header',
  templateUrl: './authorized-header.html',
  styleUrls: ['./authorized-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BsDropdownModule],
})
export class AuthorizedHeader {
  readonly route = inject(ActivatedRoute);
  readonly authStore = inject(AuthStore);
  readonly authService = inject(AuthService);

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

  logout() {
    this.authService.signOut().subscribe({
      next: () => {
        this.authStore.logout();
      },
      error: () => {
        // Optionally handle error
        this.authStore.logout();
      },
    });
  }
}
