import { ChangeDetectionStrategy, Component, inject, input, Input, OnInit } from '@angular/core';
import { EnumPriority, EnumQMSType, EnumUnit, SLAOutputDto } from '../../../models/sla.model';
import { SLAService } from '../../../services/sla.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { enumToArray } from '@shared/helper/enum-ddl-helpers';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-edit-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-modal.html',
  styleUrl: './add-edit-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditModal implements OnInit {
  mode: 'add' | 'edit' = 'add';
  @Input() sla?: SLAOutputDto;
  @Input() companyId: number | 1 = 1;
  private readonly fb = inject(FormBuilder);
  slaForm: FormGroup;
  private readonly service = inject(SLAService);
  bsModalRef = inject(BsModalRef);
  EnumUnit = EnumUnit;
  EnumPriority = EnumPriority;
  EnumQMSType = EnumQMSType;

  // 🔹 Dropdown data
  qmsTypes = enumToArray(EnumQMSType);
  priorities = enumToArray(EnumPriority);
  units = enumToArray(EnumUnit);

  constructor() {
    this.slaForm = this.fb.group({
      fkCompanyId: this.companyId,
      type: [EnumQMSType.Ticket, Validators.required],
      priority: [EnumPriority.Medium, Validators.required],
      unit: [EnumUnit.Hours, Validators.required],
      responseTime: [0, [Validators.required, Validators.min(0)]],
      resolutionTime: [0, [Validators.required, Validators.min(0)]],
      escalationTime: [0, [Validators.required, Validators.min(0)]],
    });
  }
  ngOnInit(): void {
    if (this.mode === 'edit' && this.sla) {
      this.slaForm.patchValue({
        fkCompanyId: this.companyId,
        type: this.sla.type ?? EnumQMSType.Ticket,
        priority: this.sla.priority ?? EnumPriority.Medium,
        unit: this.sla.unit ?? EnumUnit.Hours,
        responseTime: this.sla.responseTime ?? 0,
        resolutionTime: this.sla.resolutionTime ?? 0,
        escalationTime: this.sla.escalationTime ?? 0,
      });
    }
  }

  save() {
    if (this.mode === 'add') {
      this.service.create(this.slaForm.value).subscribe(() => this.bsModalRef.hide());
    } else {
      this.service
        .update(this.sla!.id!, this.slaForm.value)
        .subscribe(() => this.bsModalRef.hide());
    }
  }
}
