import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Editor, NgxEditorModule } from 'ngx-editor';
import { TicketService } from '../../../services/ticket.service';
import { derivedAsync } from 'ngxtension/derived-async';
import {
  EnumTicketStatus,
  TicketBasicDetailOutputDto,
  TicketSpecificationOutputDto,
} from '../../../models/ticket.model.model';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TicketAttachment } from './ticket-attachment/ticket-attachment';
import { TicketComment } from './ticket-comment/ticket-comment';
import { Dropdown } from '@shared/helper/components/dropdown/dropdown';
import { TicketFields } from './ticket-fields/ticket-fields';
import { TicketLinkedItems } from './ticket-linked-items/ticket-linked-items';

@Component({
  selector: 'app-ticket-view-edit',
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NgxEditorModule,
    AccordionModule,
    TicketAttachment,
    TicketComment,
    Dropdown,
    TicketFields,
    TicketLinkedItems,
  ],
  providers: [TicketService],
  templateUrl: './ticket-view-edit.html',
  styleUrl: './ticket-view-edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketViewEdit {
  ticketId = input<number>();
  private readonly ticketService = inject(TicketService);
  editor!: Editor;
  newComment = '';
  enumStatus = EnumTicketStatus;
  isDescriptionCollapsed = signal(false);
  ticketBasicDescriptionRefresh = signal(0);
  readonly ticketBasicInfo = derivedAsync(
    () => {
      this.ticketBasicDescriptionRefresh();
      return this.ticketService.getTicketBasicDetails(Number(this.ticketId()));
    },
    {
      initialValue: {} as TicketBasicDetailOutputDto,
    },
  );
  // readonly specification = derivedAsync(
  //   () => {
  //     // this.refreshTrigger();
  //     return this.ticketService.getTicketSpecifications(Number(this.ticketId()));
  //   },
  //   {
  //     initialValue: {} as TicketSpecificationOutputDto,
  //   },
  // );
  specification: TicketSpecificationOutputDto = {} as TicketSpecificationOutputDto;
  // readonly attachments = derivedAsync(
  //   () => {
  //     // this.refreshTrigger();
  //     return this.ticketService.getTicketAttachments(Number(this.ticketId()));
  //   },
  //   {
  //     initialValue: [],
  //   },
  // );
  // readonly linkingItems = derivedAsync(
  //   () => {
  //     // this.refreshTrigger();
  //     return this.ticketService.getTicketLinkings(Number(this.ticketId()));
  //   },
  //   {
  //     initialValue: [],
  //   },
  // );
  // readonly comments = derivedAsync(
  //   () => {
  //     // this.refreshTrigger();
  //     return this.ticketService.getTicketComments(Number(this.ticketId()));
  //   },
  //   {
  //     initialValue: [],
  //   },
  // );
  readonly fields = derivedAsync(
    () => {
      // this.refreshTrigger();
      return this.ticketService.getTicketFields(Number(this.ticketId()));
    },
    {
      initialValue: [],
    },
  );
  readonly watchers = derivedAsync(
    () => {
      // this.refreshTrigger();
      return this.ticketService.getTicketWatchers(Number(this.ticketId()));
    },
    {
      initialValue: [],
    },
  );

  constructor() {
    this.editor = new Editor();
  }

  // ======= MAIN TICKET DATA =======
  ticket = {
    ticketNumber: 'CHS-000245',
    subject: 'Outlook not syncing emails',
    description: `<p>Outlook stopped syncing emails since this morning. User reported issue after Windows update.<br>
    Steps taken: Checked network connection, repaired profile.</p>`,
    status: 'In Progress',
    priority: 'P2',
    createdDate: '2025-10-21T09:15:00',
    dueDate: '2025-10-21T13:15:00',
    slaStatus: 'DueSoon',
    createdByUser: { id: 1, fullName: 'John Murphy' },
    assignedToUserId: 4,
    departmentIds: [11], // ICT
    project: {
      id: 1001,
      referenceNumber: 'PROJ-1105',
      address: '12 Greenfield Avenue, Dublin',
    },
    rootCauseId: 3, // System Failure
    resolutionId: 2, // Configuration Updated

    attachments: [
      {
        fileName: 'error-screenshot.png',
        uploadedBy: { id: 3, fullName: 'Sarah Kelly' },
        createdDate: '2025-10-21T10:00:00',
      },
      {
        fileName: 'outlook-log.txt',
        uploadedBy: { id: 3, fullName: 'Sarah Kelly' },
        createdDate: '2025-10-21T10:10:00',
      },
    ],

    comments: [
      {
        id: 1,
        text: 'Investigating issue — seems related to recent Office patch KB5032341.',
        createdDate: '2025-10-21T10:25:00',
        user: { id: 4, fullName: 'Brian Walsh' },
      },
      {
        id: 2,
        text: 'Applied fix and restarted Outlook. User confirmed working again.',
        createdDate: '2025-10-21T11:45:00',
        user: { id: 4, fullName: 'Brian Walsh' },
      },
    ],

    watchers: [1, 3, 6],
  };

  // ======= DROPDOWN DATA =======

  statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

  priorities = [
    { label: 'P1 - Highest', value: 'P1' },
    { label: 'P2 - High', value: 'P2' },
    { label: 'P3 - Medium', value: 'P3' },
    { label: 'P4 - Low', value: 'P4' },
  ];

  users = [
    { id: 1, fullName: 'John Murphy' },
    { id: 2, fullName: 'Lisa Byrne' },
    { id: 3, fullName: 'Sarah Kelly' },
    { id: 4, fullName: 'Brian Walsh' },
    { id: 5, fullName: 'David Nolan' },
    { id: 6, fullName: 'Fiona Reilly' },
  ];

  departments = [
    { id: 10, name: 'Project Management' },
    { id: 11, name: 'ICT' },
    { id: 12, name: 'Customer Care' },
    { id: 13, name: 'QHSE' },
  ];

  rootCauses = [
    { id: 1, name: 'Human Error' },
    { id: 2, name: 'Process Gap' },
    { id: 3, name: 'System Failure' },
    { id: 4, name: 'Communication Breakdown' },
    { id: 5, name: 'Training Deficiency' },
  ];

  resolutions = [
    { id: 1, name: 'Issue Resolved - No Action Needed' },
    { id: 2, name: 'Configuration Updated' },
    { id: 3, name: 'Process Revised' },
    { id: 4, name: 'User Retrained' },
    { id: 5, name: 'Escalated to Vendor' },
  ];

  closeModal() {}

  uploadAttachment() {}

  addComment() {
    if (this.newComment.trim()) {
      this.ticket.comments.push({
        id: this.ticket.comments.length + 1,
        text: this.newComment,
        createdDate: new Date().toISOString(),
        user: { id: 3, fullName: 'Sarah Kelly' },
      });
      this.newComment = '';
    }
  }

  updateTicket() {
    alert('✅ Ticket updated successfully (mock save)');
  }

  updateDescription(newDescription: string) {
    this.ticketService
      .updateTicketBasicDetails(Number(this.ticketId()), {
        id: Number(this.ticketId()),
        description: newDescription,
      })
      .subscribe({
        next: (res) => {
          if (res) {
            this.ticketBasicDescriptionRefresh.update((val) => val + 1);
          }
        },
      });
  }
}
