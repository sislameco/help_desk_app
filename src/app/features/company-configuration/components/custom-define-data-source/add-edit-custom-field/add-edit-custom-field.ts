import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
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
})
export class AddEditCustomField {
  @Input() field: CustomFieldOutputDto | null = null;
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
      description: [''],
      isMultiSelect: [false],
    });
  }

  patchForm() {
    if (this.field) {
      // console.log(this.field);
      this.form.patchValue({
        fkTicketTypeId: this.field.fkTicketTypeId,
        displayName: this.field.displayName,
        dataType: this.field.dataType,
        // ddLValue: this.field.dDLValue,
        isRequired: this.field.isRequired,
        description: this.field.description,
        isMultiSelect: this.field.isMultiSelect,
      });
      // const ddlValuesArray = this.form.get('dDLValue') as FormArray;
      // ddlValuesArray.clear();
      // this.field.ddlValue.forEach(() => ddlValuesArray.push(this.fb.control('')));
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
    const input: CustomFieldDto = {
      fkTicketTypeId: this.field?.fkTicketTypeId,
      ...this.form.value,
    };

    this.service.createMany(input).subscribe({
      next: () => {
        this.saved.emit();
      },
    });
  }

  cancel() {
    this.saved.emit();
  }
}
