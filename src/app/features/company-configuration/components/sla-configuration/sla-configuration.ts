import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  EnumPriority,
  EnumQMSType,
  EnumUnit,
  SLAOutputDto,
  SlASummary,
} from '../../models/sla.model';
import { SLAService } from '../../services/sla.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddEditModal } from './add-edit-modal/add-edit-modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { derivedAsync } from 'ngxtension/derived-async';
import { EnumToStringPipe } from '@shared/helper/pipes/pipes/enum-to-string-pipe';
import { EnumRStatus } from '../../../user-management/models/user-list-model';
import { ConfirmationModal } from '@shared/helper/components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-sla-configuration',
  imports: [
    NgSelectModule,
    BsDropdownModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    EnumToStringPipe,
  ],
  templateUrl: './sla-configuration.html',
  styleUrl: './sla-configuration.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService],
})
export class SlaConfiguration implements OnInit {
  readonly id = input<string>();
  private readonly service = inject(SLAService);
  private readonly modalService = inject(BsModalService);
  enumPriority: typeof EnumPriority = EnumPriority;
  enumQMSType: typeof EnumQMSType = EnumQMSType;
  enumUnit: typeof EnumUnit = EnumUnit;
  enumRstatus: typeof EnumRStatus = EnumRStatus;
  companyId = computed(() => Number(this.id()));
  isLoading = signal(false);
  private readonly refreshTrigger = signal(0);
  readonly slas = derivedAsync(
    () => {
      this.refreshTrigger();
      return this.service.getAll(this.companyId());
    },
    {
      initialValue: [],
    },
  );
  readonly slaSummary = derivedAsync(
    () => {
      this.refreshTrigger();
      return this.service.getSummary(this.companyId());
    },
    {
      initialValue: {
        totalRules: 0,
        activeRules: 0,
        criticalRules: 0,
        avgResponse: 0,
      } as SlASummary,
    },
  );

  ngOnInit(): void {
    this.enumPriority = EnumPriority;
    this.enumQMSType = EnumQMSType;
    this.enumUnit = EnumUnit;
    this.enumRstatus = EnumRStatus;
    this.isLoading.set(true);
  }

  openAdd() {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: { sla: {} as SLAOutputDto, companyId: this.companyId() },
    };
    const modalParams = Object.assign({}, modalConfig, { class: 'modal-lg' });
    const modalRef = this.modalService.show(AddEditModal, modalParams);
    modalRef.content?.saveEmit.subscribe(() => this.refreshTrigger.update((v) => v + 1));
  }

  openEdit(sla: SLAOutputDto) {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: { sla, mode: 'edit' as const, companyId: this.companyId() },
    };
    const modalParams = Object.assign({}, modalConfig, { class: 'modal-lg' });
    const modalRef = this.modalService.show(AddEditModal, modalParams);
    modalRef.content?.saveEmit.subscribe(() => this.refreshTrigger.update((v) => v + 1));
  }

  delete(id: number) {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered',
      initialState: {
        title: 'Warning',
        message: 'Are you sure you want to delete this SLA Rule?',
      },
    };
    const bsModalRef = this.modalService.show(ConfirmationModal, modalConfig);

    bsModalRef.content?.confirmed.subscribe((result) => {
      bsModalRef.hide();
      if (result) {
        this.service.delete(id).subscribe(() => this.refreshTrigger.update((v) => v + 1));
      }
    });
  }

  /** ✅ Add this method */
  getPriorityColor(priority: EnumPriority): string {
    switch (priority) {
      case EnumPriority.Highest:
        return 'danger'; // red
      case EnumPriority.High:
        return 'warning'; // yellow
      case EnumPriority.Medium:
        return 'info'; // blue
      case EnumPriority.Low:
        return 'secondary'; // gray
      default:
        return 'light';
    }
  }
}
