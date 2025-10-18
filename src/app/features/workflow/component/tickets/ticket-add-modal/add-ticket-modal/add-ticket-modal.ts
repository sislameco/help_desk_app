import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { derivedAsync } from 'ngxtension/derived-async';
import { map, of } from 'rxjs';
import { TicketReferenceService } from '../../../../../company-configuration/services/ticket-reference-service';
import { FieldOutputDto } from '../../../../../company-configuration/models/ddl.model';
import { TicketService } from '../../../../services/ticket.service';
import { AddTicketInputDto } from '../../../../models/ticket.model.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-ticket-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectComponent],
  templateUrl: './add-ticket-modal.html',
  styleUrl: './add-ticket-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTicketModal {
  // 🔹 Inject services
  private readonly fb = inject(FormBuilder);
  private readonly ticketRef = inject(TicketReferenceService);
  private readonly ticketService = inject(TicketService);
  bsModalRef = inject(BsModalRef);
  // 🟦 New signal to toggle minimize state
  isMinimized = signal(false);
  // 🔹 Base signals (unchanged)
  fkCompanyId = 1;
  ticketTypeId = signal<number | null>(null);

  // =======================================
  // 🔹 Reactive form
  // =======================================
  form: FormGroup = this.fb.group({
    subject: [''],
    description: [''],
    isCustomer: [false],
    fkCustomerId: [null],
    fkProjectId: [null],
    fkAssignUser: [null],
    fkDepartmentId: [[]],
    files: [[]],
    fkRootCauseId: [null],
    fkTicketTypeId: [null],
    fkRelocationId: [null],
  });

  selectedFiles: File[] = [];
  uploadedFileIds: number[] = [];
  isSubmitting = signal(false);

  // =======================================
  // 🔹 derivedAsync dropdowns (unchanged)
  // =======================================
  departments = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getDepartments(this.fkCompanyId)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );

  ticketTypes = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getTicketTypes(this.fkCompanyId)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );

  rootCauses = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getRootCauses(this.fkCompanyId)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );

  customers = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getCustomers(this.fkCompanyId)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );

  projects = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getProjects(this.fkCompanyId)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );

  users = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef.getUsers(this.fkCompanyId).pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );

  subforms = derivedAsync<FieldOutputDto[]>(
    () =>
      this.fkCompanyId
        ? this.ticketRef.getSubforms(1).pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );

  // =======================================
  // 🔹 File upload handling
  // =======================================
  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files as FileList;
    this.selectedFiles = Array.from(files);
  }

  uploadFiles() {
    if (this.selectedFiles.length === 0) {
      return;
    }

    // this.fileService.uploadFiles(this.selectedFiles).subscribe({
    //   next: (res) => {
    //     this.uploadedFileIds = res.map((f) => f.id);
    //     this.form.patchValue({ files: this.uploadedFileIds });
    //   },
    // });
  }

  // =======================================
  // 🔹 onSubmit handler (used by ngSubmit)
  // =======================================
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.isSubmitting.set(true);

    const input: AddTicketInputDto = {
      fkCompanyId: this.fkCompanyId,
      subject: this.form.value.subject,
      description: this.form.value.description,
      isCustomer: this.form.value.isCustomer,
      fkCustomerId: this.form.value.fkCustomerId,
      fkProjectId: this.form.value.fkProjectId,
      fkAssignUser: this.form.value.fkAssignUser,
      fkDepartmentId: this.form.value.fkDepartmentId,
      files: this.form.value.files,
      fkTicketTypeId: 0,
      subFrom: [],
      fkRelocationId: 0,
      fkRootCauseId: 0,
    };

    this.ticketService.createTicket(input).subscribe({
      next: () => {
        this.isSubmitting.set(true);
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }
  onTicketTypeChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.ticketTypeId.set(Number(value));
  }
  closeModal() {
    this.bsModalRef.hide();
  }
  toggleMinimize() {
    this.isMinimized.update((v) => !v);
  }
}
