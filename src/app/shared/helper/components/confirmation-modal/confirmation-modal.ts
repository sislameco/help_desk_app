import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModal {
  private readonly modalRef = inject(BsModalRef);
  header = '';
  @Input() title = '';
  @Input() message = '';
  @Input() cancelButtonText = 'No';
  @Input() confirmButtonText = 'Yes';

  /**
   * @description
   * emits true if the user clicks yes button
   * emits false if the user clicks no button or closes the modal
   */
  @Output() readonly confirmed = new EventEmitter<boolean>();

  close(): void {
    this.modalRef.hide();
  }

  cancel(): void {
    this.confirmed.emit(false);
    this.modalRef.hide();
  }

  confirm(): void {
    this.confirmed.emit(true);
    this.modalRef.hide();
  }
}
