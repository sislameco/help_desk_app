export interface TicketListViewDto {
  id: number;
  ticketNumber: string;
  subject: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  createdDate: Date;
  lastUpdate: Date;
}
