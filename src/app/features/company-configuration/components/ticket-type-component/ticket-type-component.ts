import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketTypeService } from '../../services/ticket-type-service';
import { TicketTypeOutputDto } from '../../models/ticket-type.model';
import { EnumPriority, EnumQMSType } from '../../models/sla.model';
import { derivedAsync } from 'ngxtension/derived-async';
import { TicketReferenceService } from '../../services/ticket-reference-service';
import { map, of } from 'rxjs';
import { getPriorityColor } from '@shared/helper/enum-ddl-helpers';
import { EnumToStringPipe } from '@shared/helper/pipes/pipes/enum-to-string-pipe';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddEditTicketModal } from './add-edit-ticket-modal/add-edit-ticket-modal';
import { ConfirmationModal } from '@shared/helper/components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-ticket-type-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EnumToStringPipe],
  providers: [BsModalService],
  templateUrl: './ticket-type-component.html',
  styleUrls: ['./ticket-type-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketTypeComponent implements OnInit {
  getPriorityColor = getPriorityColor;
  private readonly modalService = inject(BsModalService);
  private readonly service = inject(TicketTypeService);
  private readonly ticketRef = inject(TicketReferenceService);
  enumPriority: typeof EnumPriority = EnumPriority;
  qmsType: typeof EnumQMSType = EnumQMSType;
  fkCompanyId = 1;
  // ✅ Signals for reactive UI state
  ticketTypes = signal<TicketTypeOutputDto[]>([]);
  isEditing = signal<boolean>(false);
  selectedId = signal<number | null>(null);
  loading = signal<boolean>(false);
  users = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef.getUsers(this.fkCompanyId).pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );
  departments = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getDepartments(this.fkCompanyId)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );
  form!: FormGroup;

  ngOnInit(): void {
    this.loadTicketTypes();
  }

  // ===========================
  // 🔹 Load All Ticket Types
  // ===========================
  loadTicketTypes(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (res) => {
        this.ticketTypes.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
  // ===========================
  // 🔹 Delete
  // ===========================
  delete(id: number): void {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered',
      initialState: {
        title: 'Warning',
        message: 'Are you sure you want to delete?',
      },
    };
    const bsModalRef = this.modalService.show(ConfirmationModal, modalConfig);

    bsModalRef.content?.confirmed.subscribe((result) => {
      if (result) {
        this.service.delete(id).subscribe(() => this.loadTicketTypes());
      } else {
        bsModalRef.hide();
      }
    });
  }

  openAddEditModal(selectedTicket: TicketTypeOutputDto | null = null) {
    const initialState = {
      selectedTicket,
    };
    const modalRef = this.modalService.show(AddEditTicketModal, {
      initialState,
      ignoreBackdropClick: true,
      backdrop: true,
      class: 'modal-lg',
    });

    modalRef.content?.addOrUpdateEmit.subscribe(() => {
      this.loadTicketTypes();
    });
  }
}
