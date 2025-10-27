import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { EnumPriority, EnumQMSType, EnumUnit, SLAOutputDto } from '../../../models/sla.model';
import { SLAService } from '../../../services/sla.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { enumToArray } from '@shared/helper/enum-ddl-helpers';
import { CommonModule } from '@angular/common';
import { TicketReferenceService } from '../../../services/ticket-reference-service';
import { derivedAsync } from 'ngxtension/derived-async';
import { map, of } from 'rxjs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { EnumToStringPipe } from '@shared/helper/pipes/pipes/enum-to-string-pipe';
import { TicketTypeDDL } from '../../../models/ddl.model';

@Component({
  selector: 'app-add-edit-modal',
  imports: [ReactiveFormsModule, CommonModule, NgSelectComponent, EnumToStringPipe],
  templateUrl: './add-edit-modal.html',
  styleUrl: './add-edit-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditModal implements OnInit {
  mode: 'add' | 'edit' = 'add';
  @Input() sla?: SLAOutputDto;
  @Input() companyId: number | 1 = 1;
  @Output() saveEmit = new EventEmitter<void>();
  private readonly fb = inject(FormBuilder);
  slaForm: FormGroup;
  private readonly service = inject(SLAService);
  private readonly ticketRefService = inject(TicketReferenceService);
  bsModalRef = inject(BsModalRef);
  enumUnit = EnumUnit;
  enumPriority = EnumPriority;
  enumQMSType = EnumQMSType;

  // 🔹 Dropdown data
  units = enumToArray(EnumUnit);
  // Use derivedAsync signal for ticketTypes dropdown
  ticketTypes = derivedAsync(
    () =>
      this.companyId
        ? this.ticketRefService
            .getTicketTypes(this.companyId)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );

  constructor() {
    this.slaForm = this.fb.group({
      fkTicketTypeId: [null, Validators.required],
      fkCompanyId: this.companyId,
      qmsType: [null, Validators.required],
      priority: [null, Validators.required],
      unit: [EnumUnit.Hours, Validators.required],
      responseTime: [0, [Validators.required, Validators.min(0)]],
      resolutionTime: [0, [Validators.required, Validators.min(0)]],
      escalationTime: [0, [Validators.required, Validators.min(0)]],
    });
  }
  ngOnInit(): void {
    if (this.mode === 'edit' && this.sla) {
      this.slaForm.patchValue({
        fkTicketTypeId: this.sla.fkTicketTypeId ?? null,
        fkCompanyId: this.companyId,
        qmsType: this.sla.qmsType ?? EnumQMSType.Ticket,
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
      this.service.create(this.slaForm.value).subscribe(() => {
        this.saveEmit.emit();
        this.bsModalRef.hide();
      });
    } else {
      this.service.update(this.sla!.id!, this.slaForm.value).subscribe(() => {
        this.saveEmit.emit();
        this.bsModalRef.hide();
      });
    }
  }

  onTicketTypeSelected(selected: TicketTypeDDL) {
    const ticketTypes = this.ticketTypes();
    const selectedType = ticketTypes.find((t) => t === selected);
    if (selectedType) {
      this.slaForm.patchValue({
        fkTicketTypeId: selectedType.id,
        qmsType: selectedType.qmsType,
        priority: selectedType.priority,
      });
    }
  }
}
