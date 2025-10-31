import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { Dropdown } from '@shared/helper/components/dropdown/dropdown';
import { TicketService } from '../../../../services/ticket.service';
import { derivedAsync } from 'ngxtension/derived-async';
import { FormsModule } from '@angular/forms';
import { ConfirmationModal } from '@shared/helper/components/confirmation-modal/confirmation-modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { map } from 'rxjs';
import { TicketCommentOutputDto } from '../../../../models/ticket.model.model';

@Component({
  selector: 'app-ticket-comment',
  imports: [FormsModule, Dropdown],
  providers: [TicketService, BsModalService],
  templateUrl: './ticket-comment.html',
  styleUrl: './ticket-comment.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketComment {
  ticketId = input<number>();
  private readonly ticketService = inject(TicketService);
  private readonly modalService = inject(BsModalService);
  readonly refreshTrigger = signal<number>(0);
  comments = linkedSignal(() => this.initialComments());
  initialComments = derivedAsync(
    () => {
      this.refreshTrigger();
      return this.ticketService
        .getTicketComments(Number(this.ticketId()))
        .pipe(map((comments) => comments.map((c) => ({ ...c, isEditing: false }))));
    },
    {
      initialValue: [] as TicketCommentOutputDto[],
    },
  );
  newComment = '';
  editingComment = '';

  enableEditMode(commentId: number, currentText: string) {
    this.comments.update((comments) =>
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, isEditing: true }
          : { ...comment, isEditing: false },
      ),
    );
    this.editingComment = currentText;
  }

  addComment() {
    if (this.newComment.trim()) {
      this.ticketService
        .addTicketComment(Number(this.ticketId()), this.newComment.trim())
        .subscribe(() => {
          this.refreshTrigger.update((val) => val + 1);
          this.newComment = '';
        });
    }
  }

  updateComment(commentId: number, updatedText: string) {
    this.ticketService.updateTicketComment(commentId, updatedText).subscribe(() => {
      this.refreshTrigger.update((val) => val + 1);
    });
  }

  undoChange(commentId: number) {
    this.comments.update((comments) =>
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, isEditing: false } : comment,
      ),
    );
    this.editingComment = '';
  }

  deleteComment(commentId: number) {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered',
      initialState: {
        title: 'Warning',
        message: 'Are you sure you want to delete this comment?',
      },
    };
    const bsModalRef = this.modalService.show(ConfirmationModal, modalConfig);

    bsModalRef.content?.confirmed.subscribe((result) => {
      bsModalRef.hide();
      if (result) {
        this.ticketService.deleteTicktComment(Number(this.ticketId()), commentId).subscribe(() => {
          this.refreshTrigger.update((val) => val + 1);
        });
      }
    });
  }
}
