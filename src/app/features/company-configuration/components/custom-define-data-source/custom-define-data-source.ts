import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import {
  CustomFieldOutputDto,
  FieldDisplayOrderInputDto,
  TicketTypeDropdownDto,
} from '../../models/data-config.model';
import { CustomDefineDataSourceService } from '../../services/custom-define-data-source.service';
import { EnumDataType } from '../../models/company.model';
import { CommonModule } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { derivedAsync } from 'ngxtension/derived-async';
import { Search } from '@shared/helper/components/search/search';
import { CdkDragDrop, moveItemInArray, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { NavigationExtras, Router } from '@angular/router';
import { SearchPipe } from '@shared/pipes/search-pipe';
import { AddEditCustomField } from './add-edit-custom-field/add-edit-custom-field';
import { ConfirmationModal } from '@shared/helper/components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-custom-define-data-source',
  templateUrl: './custom-define-data-source.html',
  styleUrl: './custom-define-data-source.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    BsDropdownModule,
    Search,
    DragDropModule,
    CdkDropList,
    SearchPipe,
    AddEditCustomField,
  ],
  providers: [BsModalService],
  standalone: true,
})
export class CustomDefineDataSourceComponent {
  private readonly router = inject(Router);
  private readonly service = inject(CustomDefineDataSourceService);
  private readonly modalService = inject(BsModalService);
  readonly id = input<string>();
  companyId = computed(() => Number(this.id()));
  searchText = signal('');
  isReorder = signal(false);
  selectedTicketTypeId = signal(0);
  selectedFieldId = signal(0);
  isAddEditMode = signal(false);
  selectedField = signal<CustomFieldOutputDto | null>(null);
  readonly loading = signal(false);
  private readonly refreshTrigger = signal(0);
  enumDataType: typeof EnumDataType = EnumDataType;

  readonly ticketTypes = derivedAsync(
    () => {
      this.refreshTrigger();
      return this.service.getTicketTypes(this.companyId());
    },
    {
      initialValue: [],
    },
  );

  fields = derivedAsync(
    () => {
      this.refreshTrigger();
      return this.service.getAll();
    },
    {
      initialValue: [],
    },
  );

  ticketTypesWithFields = computed(() => {
    return this.ticketTypes().map((type) => ({
      ...type,
      shouldReorder: false,
      fields: this.fields()
        .filter((field) => field.fkTicketTypeId === type.id)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    }));
  });
  constructor() {}

  deleteField(id: number | undefined) {
    if (!id) {
      return;
    }
    const modalConfig = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered',
      initialState: {
        title: 'Warning',
        message: 'Are you sure you want to delete this field?',
      },
    };
    const bsModalRef = this.modalService.show(ConfirmationModal, modalConfig);

    bsModalRef.content?.confirmed.subscribe((result) => {
      bsModalRef.hide();
      if (result) {
        this.service.delete(id).subscribe(() => this.triggerRefresh());
      }
    });
  }

  addField() {
    this.isAddEditMode.set(true);
  }

  triggerRefresh() {
    this.refreshTrigger.update((v) => v + 1);
  }

  clearAddEditMode() {
    this.isReorder.set(false);
    this.isAddEditMode.set(false);
    this.selectedField.set(null);
    this.triggerRefresh();
  }

  editField(field: CustomFieldOutputDto) {
    this.isAddEditMode.set(true);
    this.selectedField.set(field);
  }

  searchField(searchText: string) {
    const extras: NavigationExtras = {
      queryParams: { search: searchText },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    };
    this.router.navigate([], extras).then();
    this.searchText.set(searchText);
  }

  toggleTicketTypeSelection(ticketTypeId: number) {
    this.selectedTicketTypeId.update((current) => (current === ticketTypeId ? 0 : ticketTypeId));
  }

  toggleFieldSelection(fieldId: number) {
    this.selectedFieldId.update((current) => (current === fieldId ? 0 : fieldId));
  }

  dropField(
    event: CdkDragDrop<CustomFieldOutputDto[]>,
    ticketType: TicketTypeDropdownDto,
    list: CustomFieldOutputDto[],
  ) {
    this.isReorder.set(true);
    ticketType.shouldReorder = true;
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }

  onShowDropdown() {
    // Fix the dropdown not showing when container is body by triggerring an event
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }

  reorderFields() {
    const ticketTypesToReorder: FieldDisplayOrderInputDto[] = this.ticketTypesWithFields()
      .filter((tt) => tt.shouldReorder)
      .map((tt) => ({
        fkTicketTypeId: tt.id,
        fieldIds: tt.fields.map((f) => f.id!),
      }));

    this.service.reorderFields(ticketTypesToReorder).subscribe(() => {
      this.clearAddEditMode();
      this.triggerRefresh();
    });
  }
}
