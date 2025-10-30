import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-add-ticket-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectComponent, NgxControlError, NgxEditorModule],
  templateUrl: './add-ticket-modal.html',
  styleUrl: './add-ticket-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TicketReferenceService],
})
export class AddTicketModal implements OnDestroy {
  saved = output<void>();
  // 🔹 Inject services
  private readonly fb = inject(FormBuilder);
  private readonly ticketRef = inject(TicketReferenceService);
  private readonly ticketService = inject(TicketService);
  private readonly fileService = inject(FileManagementService);
  bsModalRef = inject(BsModalRef);
  // 🟦 New signal to toggle minimize state
  isMinimized = signal(false);
  // 🔹 Base signals (unchanged)
  editorRef!: Editor;
  fkCompanyId = signal<number | null>(1);
  ticketTypeId = signal<number | null>(null);
  showCustomer = false;
  showProject = false;
  EnumDataType = EnumDataType;
  companyValues = [{ id: 1, value: 'Churchfield Home Services' }];

  subforms = signal<FieldOutputDto[]>([]);
  // =======================================
  // 🔹 Reactive form
  // =======================================
  form: FormGroup = this.fb.group({
    fkCompanyId: [1, Validators.required],
    subject: ['', Validators.required],
    description: ['', Validators.required],
    isCustomer: [false],
    fkCustomerId: [null, Validators.required],
    fkProjectId: [null, Validators.required],
    fkAssignUser: [null, Validators.required],
    fkDepartmentId: [[], Validators.required],
    files: [[]],
    fkRootCauseId: [null, Validators.required],
    fkTicketTypeId: [null, Validators.required],
    subForm: this.fb.array([]),
    fkRelocationId: [null],
  });

  addedFiles = signal<{ id: number; fileName: string }[]>([]);
  isSubmitting = signal(false);

  // =======================================
  // 🔹 derivedAsync dropdowns (unchanged)
  // =======================================
  departments = derivedAsync(
    () => {
      this.fkCompanyId();
      return this.fkCompanyId()
        ? this.ticketRef
            .getDepartments(this.fkCompanyId()!)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]);
    },
    { initialValue: [] },
  );

  ticketTypes = derivedAsync(
    () => {
      this.fkCompanyId();
      return this.fkCompanyId()
        ? this.ticketRef
            .getTicketTypes(this.fkCompanyId()!)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]);
    },
    { initialValue: [] },
  );

  rootCauses = derivedAsync(
    () => {
      this.fkCompanyId();
      return this.fkCompanyId()
        ? this.ticketRef
            .getRootCauses(this.fkCompanyId()!)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]);
    },
    { initialValue: [] },
  );

  customers = derivedAsync(
    () => {
      this.fkCompanyId();
      return this.fkCompanyId()
        ? this.ticketRef
            .getCustomers(this.fkCompanyId()!)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]);
    },
    { initialValue: [] },
  );

  projects = derivedAsync(
    () => {
      this.fkCompanyId();
      return this.fkCompanyId()
        ? this.ticketRef
            .getProjects(this.fkCompanyId()!)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]);
    },
    { initialValue: [] },
  );

  users = derivedAsync(
    () => {
      this.fkCompanyId();
      return this.fkCompanyId()
        ? this.ticketRef
            .getUsers(this.fkCompanyId()!)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]);
    },
    { initialValue: [] },
  );

  constructor() {
    this.editorRef = new Editor();
    this.form.get('isCustomer')?.valueChanges.subscribe((isCustomer) => {
      if (isCustomer) {
        this.form.get('fkCustomerId')?.setValidators(Validators.required);
        this.form.get('fkProjectId')?.clearValidators();
        this.form.get('fkProjectId')?.setValue(null);
      } else {
        this.form.get('fkProjectId')?.setValidators(Validators.required);
        this.form.get('fkCustomerId')?.clearValidators();
        this.form.get('fkCustomerId')?.setValue(null);
      }
      this.form.get('fkCustomerId')?.updateValueAndValidity();
      this.form.get('fkProjectId')?.updateValueAndValidity();
    });
  }

  reloadSetupData(fkCompanyId: number) {
    this.fkCompanyId.set(fkCompanyId);
  }

  get subFormArray(): FormArray {
    return this.form.get('subForm') as FormArray;
  }

  // =======================================
  // 🔹 File upload handling
  // =======================================
  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files as FileList;
    const filesToUpload = Array.from(files).filter((f) =>
      this.addedFiles().every((af) => af.fileName !== f.name),
    );

    if (filesToUpload.length) {
      this.uploadFiles(filesToUpload);
    }
  }

  uploadFiles(files: File[]) {
    this.fileService.uploadFiles(files).subscribe({
      next: (res) => {
        res.forEach((id, index) => {
          this.addedFiles.update((current) => [...current, { id, fileName: files[index].name }]);
        });
      },
    });
  }

  removeFile(index: number) {
    this.addedFiles.update((current) => {
      const updated = [...current];
      updated.splice(index, 1);
      return updated;
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
      fkCompanyId: this.fkCompanyId()!,
      subject: this.form.value.subject,
      description: this.form.value.description,
      isCustomer: this.form.value.isCustomer,
      fkCustomerId: this.form.value.fkCustomerId,
      fkProjectId: this.form.value.fkProjectId,
      fkAssignUser: this.form.value.fkAssignUser,
      fkDepartmentId: this.form.value.fkDepartmentId,
      // files: this.form.value.files,
      files: this.addedFiles().map((f) => f.id),
      fkTicketTypeId: this.form.value.fkTicketTypeId,
      subForm: this.getSubFormData(this.form.value.subForm),
      fkRelocationId: this.form.value.fkRelocationId,
      fkRootCauseId: this.form.value.fkRootCauseId,
    };

    this.ticketService.createTicket(input).subscribe({
      next: () => {
        this.isSubmitting.set(true);
        this.bsModalRef.hide();
        this.saved.emit();
      },
      error: () => {
        this.isSubmitting.set(false);
      },
    });
  }

  getSubFormData(subForm: FieldOutputDto[]) {
    return subForm.flatMap(({ id, value }) =>
      Array.isArray(value)
        ? value.map((v) => ({ id, value: String(v) }))
        : [{ id, value: String(value) }],
    );
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
          this.subforms.set(Array.isArray(subforms) ? subforms : [subforms]);

          const subFormArray = this.subFormArray;
          subFormArray.clear();
          this.subforms().forEach((v) => {
            subFormArray.push(
              this.fb.group({
                id: [v.id],
                dataType: [v.dataType],
                isMultiSelect: [v.isMultiSelect],
                displayName: [v.displayName],
                value: [v.value],
                ddlValues: [v.ddlValue],
              }),
            );
          });
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

  ngOnDestroy(): void {
    this.editorRef.destroy();
  }
}
