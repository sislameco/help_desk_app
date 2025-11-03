import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthStore } from '@core/store/auth-store/auth.store';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AuthService } from '@core/auth/services/auth.service';

@Component({
  selector: 'app-authorized-header',
  templateUrl: './authorized-header.html',
  styleUrls: ['./authorized-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BsDropdownModule],
})
export class AuthorizedHeader {
  readonly authStore = inject(AuthStore);
  readonly authService = inject(AuthService);
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
