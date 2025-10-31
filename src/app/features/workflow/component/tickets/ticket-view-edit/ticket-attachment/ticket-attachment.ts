import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  OnDestroy,
  signal,
} from '@angular/core';
import { Dropdown } from '@shared/helper/components/dropdown/dropdown';
import { derivedAsync } from 'ngxtension/derived-async';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TicketService } from '../../../../services/ticket.service';
import { FileManagementService } from '../../../../services/file-manager-service';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationModal } from '@shared/helper/components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-ticket-attachment',
  imports: [Dropdown],
  providers: [TicketService, BsModalService],
  templateUrl: './ticket-attachment.html',
  styleUrl: './ticket-attachment.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketAttachment implements OnDestroy {
  ticketId = input<number>();
  private readonly ticketService = inject(TicketService);
  private readonly modalService = inject(BsModalService);
  private readonly fileService = inject(FileManagementService);
  ngUnsubscribe$ = new Subject<void>();
  attachments = linkedSignal(() => this.nonWriteableAttachments());
  attachmentsRefresh = signal(0);
  readonly nonWriteableAttachments = derivedAsync(
    () => {
      this.attachmentsRefresh();
      return this.ticketService.getTicketAttachments(Number(this.ticketId()));
    },
    {
      initialValue: [],
    },
  );

  uploadAttachment(event: Event) {
    const files = (event.target as HTMLInputElement).files as FileList;
    const filesToUpload = Array.from(files).filter((f) =>
      this.attachments().every((af) => af.fileName !== f.name),
    );

    if (filesToUpload.length) {
      this.fileService
        .uploadFiles(filesToUpload)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            res.forEach((id) => {
              this.ticketService
                .addTicketAttachment(Number(this.ticketId()), [id])
                .pipe(takeUntil(this.ngUnsubscribe$))
                .subscribe(() => {
                  this.attachmentsRefresh.update((v) => v + 1);
                });
            });
          },
        });
    }
  }

  removeFile(index: number) {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered',
      initialState: {
        title: 'Warning',
        message: 'Are you sure you want to delete this file?',
      },
    };
    const bsModalRef = this.modalService.show(ConfirmationModal, modalConfig);

    bsModalRef.content?.confirmed.subscribe((result) => {
      bsModalRef.hide();
      if (result) {
        this.ticketService
          .deleteTicketAttachment(this.attachments()[index].id)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe(() => {
            this.attachmentsRefresh.update((v) => v + 1);
          });
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
