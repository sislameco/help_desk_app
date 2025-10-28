import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Editor, NgxEditorModule } from 'ngx-editor';

@Component({
  selector: 'app-ticket-view-edit',
  imports: [CommonModule, FormsModule, NgSelectModule, NgxEditorModule],
  templateUrl: './ticket-view-edit.html',
  styleUrl: './ticket-view-edit.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketViewEdit {
  editor!: Editor;
  newComment = '';

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
}
