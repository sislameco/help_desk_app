import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import { CustomFieldDto, CustomFieldOutputDto } from '../../../models/data-config.model';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnumDataType } from '../../../models/company.model';
import { CustomDefineDataSourceService } from '../../../services/custom-define-data-source.service';
import { TicketReferenceService } from '../../../services/ticket-reference-service';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { derivedAsync } from 'ngxtension/derived-async';
import { map } from 'rxjs';

@Component({
  selector: 'app-add-edit-custom-field',
  imports: [ReactiveFormsModule, NgSelectComponent, NgOptionComponent],
  templateUrl: './add-edit-custom-field.html',
  styleUrl: './add-edit-custom-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [TicketReferenceService],
})
export class AddEditCustomField {
  field = input<CustomFieldOutputDto | null>();
  @Output() saved = new EventEmitter<void>();
  fb = inject(FormBuilder);
  service = inject(CustomDefineDataSourceService);
  ticketTypeService = inject(TicketReferenceService);
  form!: FormGroup;
  EnumDataType = EnumDataType;
  ticketTypes = derivedAsync(
    () => this.ticketTypeService.getTicketTypes(1).pipe(map((r) => (Array.isArray(r) ? r : [r]))),
    { initialValue: [] },
  );

  constructor() {
    this.createForm();
    effect(() => {
      this.patchForm();
    });
  }

  createForm() {
    this.form = this.fb.group({
      fkTicketTypeId: [null, Validators.required],
      displayName: ['', Validators.required],
      dataType: [EnumDataType.textInput, Validators.required],
      dDLValue: this.fb.array([]),
      isRequired: [false],
      description: ['', Validators.required],
      isMultiSelect: [false],
    });
  }

  patchForm() {
    const field = this.field();
    if (field) {
      this.form.patchValue({
        fkTicketTypeId: field.fkTicketTypeId,
        displayName: field.displayName,
        dataType: field.dataType,
        isRequired: field.isRequired,
        description: field.description,
        isMultiSelect: field.isMultiSelect,
      });
      const ddlValuesArray = this.form.get('dDLValue') as FormArray;
      ddlValuesArray.clear();
      field.ddlValue.forEach((v) => ddlValuesArray.push(this.fb.control(v)));
    }
  }

  get ddlValues(): FormArray {
    return this.form.get('dDLValue') as FormArray;
  }

  addDDLValue() {
    this.ddlValues.push(this.fb.control(''));
  }

  removeDDLValue(i: number) {
    this.ddlValues.removeAt(i);
  }

  submit() {
    const fieldData: CustomFieldDto = {
      fkTicketTypeId: this.field()?.fkTicketTypeId,
      ...this.form.value,
    };

    if (!this.field()) {
      this.service.createMany(fieldData).subscribe({
        next: () => {
          this.saved.emit();
        },
      });
    } else {
      this.service.update(this.field()!.id!, fieldData).subscribe({
        next: () => {
          this.saved.emit();
        },
      });
    }
  }

  cancel() {
    this.saved.emit();
  }
}
