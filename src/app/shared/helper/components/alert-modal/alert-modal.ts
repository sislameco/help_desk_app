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
}
