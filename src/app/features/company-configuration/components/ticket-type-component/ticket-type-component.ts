import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketTypeService } from '../../services/ticket-type-service';
import { TicketTypeInputDto, TicketTypeOutputDto } from '../../models/ticket-type.model';
import { EnumPriority } from '../../models/sla.model';
import { derivedAsync } from 'ngxtension/derived-async';
import { TicketReferenceService } from '../../services/ticket-reference-service';
import { map, of } from 'rxjs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { enumToArray, getPriorityColor } from '@shared/helper/enum-ddl-helpers';
import { EnumToStringPipe } from '@shared/helper/pipes/pipes/enum-to-string-pipe';

@Component({
  selector: 'app-ticket-type-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectComponent, EnumToStringPipe],
  templateUrl: './ticket-type-component.html',
  styleUrls: ['./ticket-type-component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketTypeComponent implements OnInit {
  getPriorityColor = getPriorityColor;
  private readonly service = inject(TicketTypeService);
  private readonly ticketRef = inject(TicketReferenceService);
  private readonly fb = inject(FormBuilder);
  priorities = enumToArray(EnumPriority);
  enumPriority: typeof EnumPriority = EnumPriority;
  fkCompanyId = 1;
  // ✅ Signals for reactive UI state
  ticketTypes = signal<TicketTypeOutputDto[]>([]);
  isEditing = signal<boolean>(false);
  selectedId = signal<number | null>(null);
  loading = signal<boolean>(false);
  users = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef.getUsers(this.fkCompanyId).pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );
  departments = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getDepartments(this.fkCompanyId)
            .pipe(map((r) => (Array.isArray(r) ? r : [r])))
        : of([]),
    { initialValue: [] },
  );
  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadTicketTypes();
  }

  // ===========================
  // 🔹 Init Reactive Form
  // ===========================
  initForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      fkAssignedUserId: [null],
      priority: [EnumPriority.Medium],
      isEnabled: [true],
      fkDepartmentIds: [[]],
      fkCompanyId: [1], // company fixed for now
    });
  }

  // ===========================
  // 🔹 Load All Ticket Types
  // ===========================
  loadTicketTypes(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (res) => {
        this.ticketTypes.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  // ===========================
  // 🔹 Create or Update
  // ===========================
  save(): void {
    if (this.form.invalid) {
      return;
    }
    const dto: TicketTypeInputDto = this.form.value;

    if (this.isEditing()) {
      this.service.update(this.selectedId()!, dto).subscribe(() => {
        this.loadTicketTypes();
        this.cancelEdit();
      });
    } else {
      this.service.create(dto).subscribe(() => {
        this.loadTicketTypes();
        this.form.reset();
      });
    }
  }

  // ===========================
  // 🔹 Edit Mode
  // ===========================
  edit(item: TicketTypeOutputDto): void {
    this.isEditing.set(true);
    this.selectedId.set(item.id);
    this.form.patchValue(item);
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.selectedId.set(null);
    this.form.reset({ isEnabled: true });
  }

  // ===========================
  // 🔹 Delete
  // ===========================
  delete(id: number): void {
    if (confirm('Are you sure you want to delete this ticket type?')) {
      this.service.delete(id).subscribe(() => this.loadTicketTypes());
    }
  }
}
