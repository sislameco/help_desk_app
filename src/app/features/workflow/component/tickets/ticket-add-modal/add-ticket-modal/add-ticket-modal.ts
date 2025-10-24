import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { derivedAsync } from 'ngxtension/derived-async';
import { map, of } from 'rxjs';
import { TicketReferenceService } from '../../../../../company-configuration/services/ticket-reference-service';
import {
  FieldOutputDto,
  TicketTypeDDL,
} from '../../../../../company-configuration/models/ddl.model';
import { TicketService } from '../../../../services/ticket.service';
import { AddTicketInputDto } from '../../../../models/ticket.model.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgSelectComponent } from '@ng-select/ng-select';
import { EnumDataType } from '../../../../../company-configuration/models/company.model';
import { NgxControlError } from 'ngxtension/control-error';
import { FileManagementService } from '../../../../services/file-manager-service';

@Component({
  selector: 'app-add-ticket-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectComponent, NgxControlError],
  templateUrl: './add-ticket-modal.html',
  styleUrl: './add-ticket-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTicketModal {
  // 🔹 Inject services
  private readonly fb = inject(FormBuilder);
  private readonly ticketRef = inject(TicketReferenceService);
  private readonly ticketService = inject(TicketService);
  private readonly fileService = inject(FileManagementService);
  bsModalRef = inject(BsModalRef);
  // 🟦 New signal to toggle minimize state
  isMinimized = signal(false);
  // 🔹 Base signals (unchanged)
  fkCompanyId = 1;
  ticketTypeId = signal<number | null>(null);
  showCustomer = false;
  showProject = false;
  EnumDataType = EnumDataType;
  companyValues = [{ id: 1, value: 'Churchfield Home Services' }];

  subforms: FieldOutputDto[] = [];
  // =======================================
  // 🔹 Reactive form
  // =======================================
  form: FormGroup = this.fb.group({
    fkCompanyId: [1],
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

    this.fileService.uploadFiles(this.selectedFiles).subscribe({
      next: (res) => {
        this.uploadedFileIds = res; // Assuming the API returns { fileIds: number[] }
        this.form.patchValue({ files: this.uploadedFileIds });
      },
    });
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
      fkTicketTypeId: this.form.value.fkTicketTypeId,
      subFrom: [],
      fkRelocationId: this.form.value.fkRelocationId,
      fkRootCauseId: this.form.value.fkRootCauseId,
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
  onTicketTypeChange(selected: TicketTypeDDL) {
    const value = Number(selected.id);
    if (isNaN(value)) {
      return;
    }

    this.ticketTypeId.set(value);

    const ticketTypeIdValue = this.ticketTypeId();
    if (ticketTypeIdValue !== null) {
      this.ticketRef.getSubforms(ticketTypeIdValue).subscribe({
        next: (subforms) => {
          this.subforms = Array.isArray(subforms) ? subforms : [subforms];
        },
      });
    }
  }
  onIsCustomerChanged(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.showCustomer = checked;
  }
  closeModal() {
    this.bsModalRef.hide();
  }
  toggleMinimize() {
    this.isMinimized.update((v) => !v);
  }
}
