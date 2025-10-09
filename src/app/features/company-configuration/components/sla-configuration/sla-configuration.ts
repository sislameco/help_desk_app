import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { EnumPriority, SLAOutputDto } from '../../models/sla.model';
import { SLAService } from '../../services/sla.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AddEditModal } from './add-edit-modal/add-edit-modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { derivedAsync } from 'ngxtension/derived-async';

@Component({
  selector: 'app-sla-configuration',
  imports: [NgSelectModule, BsDropdownModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './sla-configuration.html',
  styleUrl: './sla-configuration.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BsModalService],
})
export class SlaConfiguration {
  private readonly service = inject(SLAService);
  private readonly modalService = inject(BsModalService);
  isLoading = signal(false);

  readonly slas = derivedAsync(() => this.service.getAll(), {
    initialValue: [],
  });

  openAdd() {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: { sla: {} as SLAOutputDto },
    };
    const modalParams = Object.assign({}, modalConfig, { class: 'modal-lg' });
    this.modalService.show(AddEditModal, modalParams);
  }

  openEdit(sla: SLAOutputDto) {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: { sla, mode: 'edit' as const },
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
