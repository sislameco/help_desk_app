import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { TicketFieldInputDto, TicketFieldOutputDto } from '../../../../models/ticket.model.model';
import { EnumDataType } from '../../../../../company-configuration/models/company.model';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldOutputDto } from '../../../../../company-configuration/models/ddl.model';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TicketReferenceService } from '../../../../../company-configuration/services/ticket-reference-service';
import { derivedAsync } from 'ngxtension/derived-async';
import { TicketService } from '../../../../services/ticket.service';

@Component({
  selector: 'app-ticket-fields',
  imports: [ReactiveFormsModule, NgSelectComponent],
  providers: [TicketReferenceService],
  templateUrl: './ticket-fields.html',
  styleUrl: './ticket-fields.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketFields {
  private readonly ticketService = inject(TicketService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  currentTicketTypeFields = signal<FieldOutputDto[]>([]);
  ticketId = input<number>();
  // fields = input<TicketFieldOutputDto[]>([]);
  // fieldsApiData = input<TicketFieldOutputDto[]>([]);
  EnumDataType = EnumDataType;
  form: FormGroup = this.fb.group({
    additionalFields: this.fb.array([]),
  });

  isFormValueChanged = signal(false);

  refreshTrigger = signal(0);
  readonly fieldsApiData = derivedAsync(
    () => {
      this.refreshTrigger();
      return this.ticketService.getTicketFields(Number(this.ticketId()));
    },
    {
      initialValue: [],
    },
  );

  fields = computed(() => {
    const mergedValues = this.fieldsApiData().reduce<Record<string, TicketFieldOutputDto>>(
      (acc, item) => {
        // Create a unique key for dropdownList fields
        const key =
          item.dataType === EnumDataType.dropdownList
            ? `dropdown_${item.fkCustomeFieldId}`
            : `other_${item.id}`; // unique for non-dropdown items

        if (!acc[key]) {
          // Initialize entry, ensure value is an array
          acc[key] = {
            ...item,
            value: Array.isArray(item.value) ? item.value : [item.value],
          };
        } else {
          // Merge dropdownList values if same fkCustomeFieldId
          const existing = acc[key];
          const existingValues = Array.isArray(existing.value) ? existing.value : [existing.value];
          const newValues = Array.isArray(item.value) ? item.value : [item.value];

          existing.value = Array.from(new Set([...existingValues, ...newValues]));
        }

        return acc;
      },
      {},
    );
    this.patchForm(Object.values(mergedValues));
    return Object.values(mergedValues);
  });

  constructor() {
    effect(() => {
      const fields = this.fields();
      if (fields.length > 0) {
        this.patchForm(fields);
        this.cdr.markForCheck();
      }
    });
    this.form.valueChanges.subscribe(() => {
      // console.log('Form value changed');
      this.isFormValueChanged.set(true);
    });
  }

  patchForm(fields: TicketFieldOutputDto[]) {
    // console.log(fields);
    const additionalFieldsArray = this.additionalFieldsArray;
    additionalFieldsArray.clear();
    fields.forEach((v) => {
      additionalFieldsArray.push(
        this.fb.group({
          id: [v.id],
          fkCustomeFieldId: [v.fkCustomeFieldId],
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

  getadditionalFieldsData(additionalFields: TicketFieldOutputDto[]): TicketFieldInputDto[] {
    return additionalFields.flatMap(({ id, fkCustomeFieldId, value }) =>
      Array.isArray(value)
        ? value.map((v) => ({
            id,
            fkCustomField: fkCustomeFieldId,
            value: String(v),
          }))
        : [{ id, fkCustomField: fkCustomeFieldId, value: String(value) }],
    );
  }

  onSubmit() {
    // this.ticketService
    //   .updateTicketFields(
    //     Number(this.ticketId()),
    //     this.getadditionalFieldsData(this.additionalFieldsArray.value),
    //   )
    //   .subscribe({
    //     next: () => {
    //       this.isFormValueChanged.set(false);
    //       this.refreshTrigger.update((v) => v + 1);
    //     },
    //   });
  }
}
