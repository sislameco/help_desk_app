import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CustomFieldOutputDto } from '../../models/data-config.model';
import { CustomDefineDataSourceService } from '../../services/custom-define-data-source.service';
import { EnumToStringPipe } from '@shared/helper/pipes/pipes/enum-to-string-pipe';
import { EnumDataType } from '../../models/company.model';
import { CustomFieldModalComponent } from './custom-field-modal/custom-field-modal';
import { CommonModule } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-custom-define-data-source',
  templateUrl: './custom-define-data-source.html',
  styleUrl: './custom-define-data-source.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EnumToStringPipe, CommonModule],
  providers: [BsModalService],
  standalone: true,
})
export class CustomDefineDataSourceComponent {
  private readonly service = inject(CustomDefineDataSourceService);
  private readonly modalService = inject(BsModalService);
  readonly fields = signal<CustomFieldOutputDto[]>([]);
  readonly loading = signal(false);
  enumDataType: typeof EnumDataType = EnumDataType;
  constructor() {
    this.loadFields();
  }

  loadFields() {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (res) => {
        this.fields.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  deleteField(id: number | undefined) {
    if (!id) {
      return;
    }
    if (confirm('Are you sure you want to delete this field?')) {
      this.service.delete(id).subscribe(() => {
        this.fields.update((fields) => fields.filter((f) => f.id !== id));
      });
    }
  }

  addField() {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: { mode: 'edit' as const, fkTicketTypeId: 0 },
    };
    const modalParams = Object.assign({}, modalConfig, { class: 'modal-lg' });
    this.modalService.show(CustomFieldModalComponent, modalParams);
  }

  editField(field: CustomFieldOutputDto) {
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      initialState: { mode: 'edit' as const, fkTicketTypeId: field.id },
    };
    const modalParams = Object.assign({}, modalConfig, { class: 'modal-lg' });
    this.modalService.show(CustomFieldModalComponent, modalParams);
  }
}
