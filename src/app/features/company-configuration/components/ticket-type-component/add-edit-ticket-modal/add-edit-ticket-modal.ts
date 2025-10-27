import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgxControlError } from 'ngxtension/control-error';
import { derivedAsync } from 'ngxtension/derived-async';
import { map, of } from 'rxjs';
import { TicketReferenceService } from '../../../services/ticket-reference-service';
import { TicketTypeInputDto, TicketTypeOutputDto } from '../../../models/ticket-type.model';
import { TicketTypeService } from '../../../services/ticket-type-service';
import { enumToArray } from '@shared/helper/enum-ddl-helpers';
import { EnumPriority, EnumQMSType } from '../../../models/sla.model';

@Component({
  selector: 'app-add-edit-ticket-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectComponent, NgxControlError],
  templateUrl: './add-edit-ticket-modal.html',
  styleUrl: './add-edit-ticket-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditTicketModal implements OnInit {
  @Input() selectedTicket: TicketTypeOutputDto | null = null;
  @Output() addOrUpdateEmit = new EventEmitter<void>();
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(TicketTypeService);
  private readonly ticketRef = inject(TicketReferenceService);
  modalRef = inject(BsModalRef);
  form!: FormGroup;

  priorities = enumToArray(EnumPriority);
  qmsTypes = enumToArray(EnumQMSType);
  fkCompanyId = 1;
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

  ngOnInit(): void {
    this.initForm();
    if (this.selectedTicket) {
      this.patchForm();
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      fkAssignedUserId: [null],
      priority: [null, Validators.required],
      qmsType: [null, Validators.required],
      isEnabled: [true],
      fkDepartmentIds: [[]],
      fkCompanyId: [1], // company fixed for now
    });
  }

  patchForm() {
    if (this.selectedTicket) {
      this.form.patchValue({
        title: this.selectedTicket.title,
        description: this.selectedTicket.description,
        fkAssignedUserId: this.selectedTicket.fkAssignedUserId,
        priority: this.selectedTicket.priority,
        qmsType: this.selectedTicket.qmsType,
        isEnabled: this.selectedTicket.isEnabled,
        fkDepartmentIds: this.selectedTicket.fkDepartmentIds,
        fkCompanyId: this.selectedTicket.fkCompanyId,
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    const dto: TicketTypeInputDto = this.form.value;

    if (this.selectedTicket) {
      this.service.update(this.selectedTicket.id, dto).subscribe(() => {
        this.addOrUpdateEmit.emit();
        this.modalRef.hide();
      });
    } else {
      this.service.create(dto).subscribe(() => {
        this.addOrUpdateEmit.emit();
        this.modalRef.hide();
      });
    }
  }
}
