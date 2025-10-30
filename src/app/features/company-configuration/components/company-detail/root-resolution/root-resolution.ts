import {
  Component,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  TemplateRef,
} from '@angular/core';
import { RootResolutionService } from '../../../services/root-resolution.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  EnumRootResolutionType,
  RootCauseInputDto,
  RootCauseOutDto,
} from '../../../models/root-resolution.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EnumToStringPipe } from '@shared/helper/pipes/pipes/enum-to-string-pipe';
import { NgOptionComponent, NgSelectComponent } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ConfirmationModal } from '@shared/helper/components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-root-resolution',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EnumToStringPipe,
    NgSelectComponent,
    NgOptionComponent,
    BsDropdownModule,
  ],
  templateUrl: './root-resolution.html',
  styleUrls: ['./root-resolution.scss'],
  providers: [BsModalService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootResolution implements OnInit {
  private readonly service = inject(RootResolutionService);
  private readonly modalService = inject(BsModalService);

  rootResolutions = signal<RootCauseOutDto[]>([]);
  selectedType = EnumRootResolutionType.RootCause;
  enumRootResolutionType: typeof EnumRootResolutionType = EnumRootResolutionType;
  modalRef?: BsModalRef;
  companyId = 1;
  formModel: RootCauseInputDto = {
    id: 0,
    name: '',
    description: '',
    displayOrder: 0,
    fkCompanyId: this.companyId,
    type: EnumRootResolutionType.RootCause,
    task: 1, // EnumCrud.Create
  };
  isViewMode = false;

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.service.getAll(this.companyId, this.selectedType).subscribe({
      next: (data) => this.rootResolutions.set(data),
    });
  }

  onTypeChange(type: EnumRootResolutionType) {
    this.selectedType = type;
    this.load();
  }

  openModal(template: TemplateRef<unknown>, mode: 'add' | 'edit' | 'view', data?: RootCauseOutDto) {
    this.isViewMode = mode === 'view';
    if (mode === 'add') {
      this.formModel = {
        id: 0,
        name: '',
        description: '',
        displayOrder: 0,
        fkCompanyId: this.companyId,
        type: this.selectedType,
        task: 1,
      };
    } else if (data) {
      this.formModel = { ...data, fkCompanyId: this.companyId, task: 1 };
    }
    this.modalRef = this.modalService.show(template, { class: 'modal-lg modal-dialog-centered' });
  }

  save() {
    this.service.save(this.formModel).subscribe({
      next: () => {
        this.modalRef?.hide();
        this.load();
      },
    });
  }

  delete(id: number) {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered',
      initialState: {
        title: 'Warning',
        message: 'Are you sure to delete this item?',
      },
    };
    const bsModalRef = this.modalService.show(ConfirmationModal, modalConfig);

    bsModalRef.content?.confirmed.subscribe((result) => {
      bsModalRef.hide();
      if (result) {
        this.service.delete(id).subscribe(() => this.load());
      }
    });
  }
}
