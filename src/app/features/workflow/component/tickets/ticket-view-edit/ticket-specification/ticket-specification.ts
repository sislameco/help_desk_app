import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { TicketService } from '../../../../services/ticket.service';
import { derivedAsync } from 'ngxtension/derived-async';
import {
  EnumPriority,
  EnumTicketStatus,
  TicketSpecificationOutputDto,
} from '../../../../models/ticket.model.model';
import { NgSelectComponent } from '@ng-select/ng-select';
import { enumToArray } from '@shared/helper/enum-ddl-helpers';
import { FormsModule } from '@angular/forms';
import { TicketReferenceService } from '../../../../../company-configuration/services/ticket-reference-service';
import { map } from 'rxjs';

@Component({
  selector: 'app-ticket-specification',
  imports: [FormsModule, NgSelectComponent],
  providers: [TicketReferenceService, TicketService],
  templateUrl: './ticket-specification.html',
  styleUrl: './ticket-specification.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketSpecification {
  ticketId = input<number>();
  companyId = input<number>();
  ticketStatus = input.required<number>();
  ticketPriority = input.required<number>();
  ticketPriorityForForm = linkedSignal(() => this.ticketPriority());
  enumTicketStatus = EnumTicketStatus;
  enumTicketPriority = EnumPriority;
  priorities = enumToArray(EnumPriority);
  private readonly ticketService = inject(TicketService);
  private readonly ticketRefService = inject(TicketReferenceService);
  refreshTrigger = signal(0);

  readonly specification = derivedAsync(
    () => {
      this.refreshTrigger();
      return this.ticketService.getTicketSpecifications(Number(this.ticketId()));
    },
    {
      initialValue: {} as TicketSpecificationOutputDto,
    },
  );

  readonly users = derivedAsync(
    () =>
      this.ticketRefService
        .getUsers(Number(this.companyId()))
        .pipe(map((u) => (Array.isArray(u) ? u : [u]))),
    {
      initialValue: [],
    },
  );

  readonly rootCauses = derivedAsync(
    () =>
      this.ticketRefService
        .getRootCauses(Number(this.companyId()))
        .pipe(map((c) => (Array.isArray(c) ? c : [c]))),
    {
      initialValue: [],
    },
  );

  readonly departments = derivedAsync(
    () =>
      this.ticketRefService
        .getDepartments(Number(this.companyId()))
        .pipe(map((d) => (Array.isArray(d) ? d : [d]))),
    {
      initialValue: [],
    },
  );

  readonly projects = derivedAsync(
    () =>
      this.ticketRefService
        .getProjects(Number(this.companyId()))
        .pipe(map((p) => (Array.isArray(p) ? p : [p]))),
    {
      initialValue: [],
    },
  );

  readonly customers = derivedAsync(
    () =>
      this.ticketRefService
        .getCustomers(Number(this.companyId()))
        .pipe(map((c) => (Array.isArray(c) ? c : [c]))),
    {
      initialValue: [],
    },
  );
}
