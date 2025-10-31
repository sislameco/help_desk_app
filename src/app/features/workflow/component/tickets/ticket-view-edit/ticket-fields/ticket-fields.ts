import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { TicketFieldOutputDto } from '../../../../models/ticket.model.model';
import { EnumDataType } from '../../../../../company-configuration/models/company.model';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldOutputDto } from '../../../../../company-configuration/models/ddl.model';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TicketReferenceService } from '../../../../../company-configuration/services/ticket-reference-service';

@Component({
  selector: 'app-ticket-fields',
  imports: [ReactiveFormsModule, NgSelectComponent],
  providers: [TicketReferenceService],
  templateUrl: './ticket-fields.html',
  styleUrl: './ticket-fields.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketFields {
  private readonly ticketRef = inject(TicketReferenceService);
  private readonly fb = inject(FormBuilder);
  currentTicketTypeFields = signal<FieldOutputDto[]>([]);
  fields = input<TicketFieldOutputDto[]>([]);
  EnumDataType = EnumDataType;
  form: FormGroup = this.fb.group({
    additionalFields: this.fb.array([]),
  });

  constructor() {
    effect(() => {
      this.patchForm();
    });
  }

  patchForm() {
    const additionalFieldsArray = this.additionalFieldsArray;
    this.fields().forEach((v) => {
      additionalFieldsArray.push(
        this.fb.group({
          id: [v.fkCustomeFieldId],
          dataType: [v.dataType || EnumDataType.textInput],
          isMultiSelect: [v.isMultiSelect || false],
          displayName: [v.displayName || ''],
          value: [v.value],
          ddlValues: [v.ddlValue || []],
        }),
      );
    });
  }

  get additionalFieldsArray(): FormArray {
    return this.form.get('additionalFields') as FormArray;
  }

  getadditionalFieldsData(additionalFields: FieldOutputDto[]) {
    return additionalFields.flatMap(({ id, value }) =>
      Array.isArray(value)
        ? value.map((v) => ({ id, value: String(v) }))
        : [{ id, value: String(value) }],
    );
  }

  onSubmit() {
    // console.log('Form submitted');
  }
}
