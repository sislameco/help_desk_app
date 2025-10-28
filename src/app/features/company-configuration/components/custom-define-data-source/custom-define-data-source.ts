import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { CustomFieldOutputDto } from '../../models/data-config.model';
import { CustomDefineDataSourceService } from '../../services/custom-define-data-source.service';
import { EnumToStringPipe } from '@shared/helper/pipes/pipes/enum-to-string-pipe';
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

@Component({
  selector: 'app-custom-define-data-source',
  templateUrl: './custom-define-data-source.html',
  styleUrl: './custom-define-data-source.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EnumToStringPipe,
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
  // selectedField: CustomFieldOutputDto | null = null;
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
      fields: this.fields()
        .filter((field) => field.fkTicketTypeId === type.id)
        .sort((a, b) => a.displayOrder - b.displayOrder),
    }));
  });
  constructor() {
    // this.loadFields();
  }

  // loadFields() {
  //   this.loading.set(true);
  //   this.service.getAll().subscribe({
  //     next: (res) => {
  //       this.fields.set(res);
  //       this.loading.set(false);
  //     },
  //     error: () => {
  //       this.loading.set(false);
  //     },
  //   });
  // }

  deleteField(id: number | undefined) {
    if (!id) {
      return;
    }
    // if (confirm('Are you sure you want to delete this field?')) {
    //   this.service.delete(id).subscribe(() => {
    //     this.fields.update((fields) => fields.filter((f) => f.id !== id));
    //   });
    // }
  }

  addField() {
    this.isAddEditMode.set(true);
    // const modalConfig = {
    //   backdrop: true,
    //   ignoreBackdropClick: true,
    //   initialState: { mode: 'edit' as const, fkTicketTypeId: 0 },
    // };
    // const modalParams = Object.assign({}, modalConfig, { class: 'modal-lg' });
    // const modalRef = this.modalService.show(CustomFieldModalComponent, modalParams);
    // modalRef.content?.saved.subscribe(() => {
    //   this.triggerRefresh();
    // });
  }

  triggerRefresh() {
    this.refreshTrigger.update((v) => v + 1);
  }

  clearAddEditMode() {
    this.isReorder.set(false);
    this.isAddEditMode.set(false);
    // this.selectedField = null;
    this.selectedField.set(null);
    this.triggerRefresh();
  }

  editField(field: CustomFieldOutputDto) {
    // const modalConfig = {
    //   backdrop: true,
    //   ignoreBackdropClick: true,
    //   initialState: { mode: 'edit' as const, fkTicketTypeId: field.id },
    // };
    // const modalParams = Object.assign({}, modalConfig, { class: 'modal-lg' });
    // this.modalService.show(CustomFieldModalComponent, modalParams);
    this.isAddEditMode.set(true);
    // this.selectedField = field;
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

  dropField(event: CdkDragDrop<CustomFieldOutputDto[]>, list: CustomFieldOutputDto[]) {
    this.isReorder.set(true);
    moveItemInArray(list, event.previousIndex, event.currentIndex);
  }

  onShowDropdown() {
    // Fix the dropdown not showing when container is body by triggerring an event
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 0);
  }
}
