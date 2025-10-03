import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  OnChanges,
} from '@angular/core';
import { CompanyDefineDataSourceDto, EnumDataSource } from '../../../models/company.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-add-update-define-data',
  imports: [ReactiveFormsModule],
  templateUrl: './add-update-define-data.html',
  styleUrl: './add-update-define-data.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // standalone: true,
})
export class AddUpdateDefineData implements OnChanges {
  // control modal visibility
  @Input() initialData?: CompanyDefineDataSourceDto; // for edit mode
  @Output() closed = new EventEmitter<void>(); // notify parent when closed
  @Output() saved = new EventEmitter<CompanyDefineDataSourceDto>(); // return form data
  showDataSourceModal = false;
  bsModalRef = inject(BsModalRef);
  fb: FormBuilder = inject(FormBuilder);
  private companyService = inject(CompanyService);
  selectedDataSource?: CompanyDefineDataSourceDto;
  dataSourceForm: FormGroup;
  enumDataSource = EnumDataSource;
  constructor() {
    this.dataSourceForm = this.fb.group({
      id: [0],
      source: [''],
      isValidate: [false],
      isSync: [false],
      jsonData: [''],
    });
  }
  get enumKeys() {
    return Object.keys(this.enumDataSource).filter((k) =>
      isNaN(Number(k)),
    ) as (keyof typeof EnumDataSource)[];
  }
  ngOnChanges() {
    if (this.initialData) {
      this.dataSourceForm.patchValue(this.initialData);
    }
  }

  checkEndpoint(event: string) {
    this.companyService.checkEndpoint(event).subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) {
        this.dataSourceForm.patchValue({ isValidate: true });
      } else {
        this.dataSourceForm.patchValue({ isValidate: false, jsonData: JSON.stringify(data) });
      }
    });
  }

  save() {
    if (this.dataSourceForm.valid) {
      this.saved.emit(this.dataSourceForm.value);
      this.bsModalRef.hide();
    }
  }
}
