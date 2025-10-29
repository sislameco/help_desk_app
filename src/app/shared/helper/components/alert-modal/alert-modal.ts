import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-alert-modal',
  imports: [],
  templateUrl: './alert-modal.html',
  styleUrl: './alert-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertModal {
  bsModalRef = inject(BsModalRef);

  title = 'Alert';
  message = 'Are you sure?';
  buttonText = 'Yes';

  // callback from service
  onClose: (confirmed: boolean) => void = () => {};

  confirm() {
    this.onClose(true);
  }

  cancel() {
    this.onClose(false);
  }
}
