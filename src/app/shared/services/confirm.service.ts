import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertModal } from '@shared/helper/components/alert-modal/alert-modal';

@Injectable({
  providedIn: 'root',
})
export class ConfirmService {
  modalService = inject(BsModalService);

  confirm(title: string, message: string, buttonText = 'Yes'): Observable<boolean> {
    const result$ = new Subject<boolean>();

    const bsModalRef: BsModalRef = this.modalService.show(AlertModal, {
      class: 'modal-dialog-centered', // optional styling
      initialState: {
        title,
        message,
        buttonText,
        onClose: (confirmed: boolean) => {
          result$.next(confirmed);
          result$.complete();
          bsModalRef.hide();
        },
      },
    });

    return result$.asObservable();
  }
}
