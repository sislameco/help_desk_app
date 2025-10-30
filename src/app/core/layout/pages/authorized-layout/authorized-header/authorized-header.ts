import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthStore } from '@core/store/auth-store/auth.store';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-authorized-header',
  templateUrl: './authorized-header.html',
  styleUrls: ['./authorized-header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BsDropdownModule],
})
export class AuthorizedHeader {
  readonly authStore = inject(AuthStore);
  logout() {
    this.authStore.logout();
  }
}
