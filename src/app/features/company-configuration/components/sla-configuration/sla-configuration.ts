import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { EnumPriority, EnumQMSType, EnumUnit, SLAOutputDto } from '../../models/sla.model';
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
import { ActivatedRoute } from '@angular/router';

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
  private readonly service = inject(SLAService);
  private readonly modalService = inject(BsModalService);
  enumPriority: typeof EnumPriority = EnumPriority;
  enumQMSType: typeof EnumQMSType = EnumQMSType;
  enumUnit: typeof EnumUnit = EnumUnit;
  enumRstatus: typeof EnumRStatus = EnumRStatus;
  private route = inject(ActivatedRoute);
  companyId = Number(this.route.snapshot.paramMap.get('id'));
  isLoading = signal(false);
  totalRules = 0;
  activeRules = 0;
  criticalRules = 0;
  avgResponse = 0;
  avgResolution = 0;
  readonly slas = derivedAsync(() => this.service.getAll(), {
    initialValue: [],
  });

  ngOnInit(): void {
    this.enumPriority = EnumPriority;
    this.enumQMSType = EnumQMSType;
    this.enumUnit = EnumUnit;
    this.enumRstatus = EnumRStatus;
    this.avgResponse = 0;
    this.totalRules = 0;
    this.activeRules = 0;
    this.criticalRules = 0;
    this.avgResponse = 0;
    this.avgResolution = 0;
    this.isLoading.set(true);
  }

  openAdd() {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: { sla: {} as SLAOutputDto, companyId: this.companyId },
    };
    const modalParams = Object.assign({}, modalConfig, { class: 'modal-lg' });
    this.modalService.show(AddEditModal, modalParams);
  }

  openEdit(sla: SLAOutputDto) {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: { sla, mode: 'edit' as const, companyId: this.companyId },
    };
    const modalParams = Object.assign({}, modalConfig, { class: 'modal-lg' });
    this.modalService.show(AddEditModal, modalParams);
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this SLA Rule?')) {
      this.service.delete(id).subscribe(() => this.slas());
    }
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
