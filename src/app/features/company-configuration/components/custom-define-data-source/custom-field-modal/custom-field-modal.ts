import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EnumDataType } from '../../../models/company.model';
import { CustomFieldDto } from '../../../models/data-config.model';
import { CustomDefineDataSourceService } from '../../../services/custom-define-data-source.service';

@Component({
  selector: 'app-custom-field-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './custom-field-modal.html',
  styleUrl: './custom-field-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CustomFieldModalComponent {
  @Input() fkTicketTypeId!: number;
  @Output() saved = new EventEmitter<void>();
  bsModalRef = inject(BsModalRef);
  fb = inject(FormBuilder);
  service = inject(CustomDefineDataSourceService);

  form: FormGroup;
  EnumDataType = EnumDataType;

  constructor() {
    this.form = this.fb.group({
      displayName: ['', Validators.required],
      dataType: [EnumDataType.textInput, Validators.required],
      dDLValue: this.fb.array([]),
      isRequired: [false],
      description: [''],
      isMultiSelect: [false],
    });
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
    this.service.createMany(this.form.value).subscribe({
      next: () => {
        this.saved.emit();
        this.bsModalRef.hide();
      },
    });
    if (this.form.invalid) {
      return;
    }

    const input: CustomFieldDto = {
      fkTicketTypeId: this.fkTicketTypeId,
      ...this.form.value,
    };

    this.service.createMany(input).subscribe({
      next: () => {
        this.saved.emit();
        this.bsModalRef.hide();
      },
    });
  }

  cancel() {
    this.bsModalRef.hide();
  }
}
