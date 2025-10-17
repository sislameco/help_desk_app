import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { derivedAsync } from 'ngxtension/derived-async';
import { TicketReferenceService } from '../../../../../company-configuration/services/ticket-reference-service';
import { FieldOutputDto } from '../../../../../company-configuration/models/ddl.model';
import { map, of } from 'rxjs';

@Component({
  selector: 'app-add-ticket-modal',
  imports: [],
  templateUrl: './add-ticket-modal.html',
  styleUrl: './add-ticket-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTicketModal {
  private readonly ticketRef = inject(TicketReferenceService);

  fkCompanyId = 1; // Set this signal as needed
  ticketTypeId = signal<number | null>(null); // Set this signal as needed

  departments = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getDepartments(this.fkCompanyId)
            .pipe(map((result) => (Array.isArray(result) ? result : [result])))
        : of([]),
    { initialValue: [] },
  );

  ticketTypes = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getTicketTypes(this.fkCompanyId)
            .pipe(map((result) => (Array.isArray(result) ? result : [result])))
        : of([]),
    { initialValue: [] },
  );

  rootCauses = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getRootCauses(this.fkCompanyId)
            .pipe(map((result) => (Array.isArray(result) ? result : [result])))
        : of([]),
    { initialValue: [] },
  );

  relocations = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getRelocations(this.fkCompanyId)
            .pipe(map((result) => (Array.isArray(result) ? result : [result])))
        : of([]),
    { initialValue: [] },
  );

  customers = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getCustomers(this.fkCompanyId)
            .pipe(map((result) => (Array.isArray(result) ? result : [result])))
        : of([]),
    { initialValue: [] },
  );

  projects = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getProjects(this.fkCompanyId)
            .pipe(map((result) => (Array.isArray(result) ? result : [result])))
        : of([]),
    { initialValue: [] },
  );

  users = derivedAsync(
    () =>
      this.fkCompanyId
        ? this.ticketRef
            .getUsers(this.fkCompanyId)
            .pipe(map((result) => (Array.isArray(result) ? result : [result])))
        : of([]),
    { initialValue: [] },
  );

  subforms = derivedAsync<FieldOutputDto[]>(
    () =>
      this.fkCompanyId
        ? this.ticketRef.getSubforms(1).pipe(
            // Ensure the result is always an array
            map((result) => (Array.isArray(result) ? result : [result])),
          )
        : of([]),
    { initialValue: [] },
  );
}
