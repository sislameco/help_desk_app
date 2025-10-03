import { inject } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CompanyDefineDataSourceDto, CompanyDto, EnumDataSource } from '../../models/company.model';
import { ActivatedRoute } from '@angular/router';
import { Component, ChangeDetectionStrategy, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddUpdateDefineData } from './add-update-define-data/add-update-define-data';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [NgSelectModule, BsDropdownModule, FormsModule, ReactiveFormsModule],
  templateUrl: './company-detail.html',
  styleUrls: ['./company-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService],
})
export class CompanyDetail implements OnInit {
  bsModalRef?: BsModalRef;
  private fb = inject(FormBuilder);
  private modalService = inject(BsModalService);
  private companyService = inject(CompanyService);
  private route = inject(ActivatedRoute);
  id = Number(this.route.snapshot.paramMap.get('id'));
  company!: CompanyDto;
  save = new EventEmitter<CompanyDto>();
  departmentValid: boolean | null = null;
  userValid: boolean | null = null;
  form!: FormGroup;
  showDataSourceModal = false;
  selectedDataSource?: CompanyDefineDataSourceDto;
  enumDataSource: typeof EnumDataSource = EnumDataSource;
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      shortName: ['', Validators.required],
      description: [''],
      accessKey: [''],
      secretKey: [''],
      prefixTicket: [''],
      // 👇 matches CompanyDto.dataSource
      dataSource: this.fb.array([]),
    });
    this.addDataSource();

    this.companyService.getCompanyById(this.id).subscribe((company) => {
      this.company = company;
      this.form.patchValue(company);
    });
  }
  get dataSource(): FormArray {
    return this.form.get('dataSource') as FormArray;
  }

  addDataSource() {
    this.dataSource.push(
      this.fb.group({
        id: [0],
        source: [''],
        isValidate: [false],
        isSync: [false],
        jsonData: [''],
      }),
    );
  }
  checkEndpoint(event: FocusEvent, type: 'department' | 'user') {
    const inputElement = event.target as HTMLInputElement;
    const url = inputElement.value;
    if (!url) {
      if (type === 'department') {
        this.departmentValid = null;
      } else {
        this.userValid = null;
      }
      return;
    }

    this.companyService.checkEndpoint(url).subscribe((data) => {
      if (Array.isArray(data) && data.length > 0) {
        if (type === 'department') {
          this.departmentValid = true;
        } else {
          this.userValid = true;
        }
      } else {
        if (type === 'department') {
          this.departmentValid = false;
        } else {
          this.userValid = false;
        }
      }
    });
  }
  submit() {
    if (this.form.valid) {
      const updated: CompanyDto = { ...this.company, ...this.form.value };

      this.companyService.updateCompany(this.id, updated).subscribe({
        // next: (res) => {},
        // error: (err) => {},
      });
    }
  }

  openDataSourceModal(ds?: CompanyDefineDataSourceDto) {
    const initialState = {
      initialData: ds, // pass data if editing
    };

    this.bsModalRef = this.modalService.show(AddUpdateDefineData, {
      class: 'modal-lg',
      initialState,
    });

    // subscribe to modal's saved event
    this.bsModalRef.content.saved.subscribe((result: CompanyDefineDataSourceDto) => {
      this.onDataSourceSaved(result);
      // add or update your FormArray here
    });
  }

  onDataSourceSaved(newSource: CompanyDefineDataSourceDto) {
    // if editing (id exists in list) -> update it
    const index = this.dataSource.value.findIndex(
      (ds: CompanyDefineDataSourceDto) => ds.id === newSource.id,
    );

    if (index > -1) {
      // update existing
      this.dataSource.at(index).patchValue(newSource);
    } else {
      // add new
      this.dataSource.push(
        this.fb.group({
          id: [newSource.id || 0],
          source: [newSource.source],
          isValidate: [newSource.isValidate],
          isSync: [newSource.isSync],
          jsonData: [newSource.jsonData],
        }),
      );
    }

    this.showDataSourceModal = false;
  }

  saveDataSources() {}
}
