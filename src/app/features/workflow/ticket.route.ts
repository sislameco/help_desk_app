import { Routes } from '@angular/router';
import { TicketCentre } from '../workflow/component/tickets/ticket-center/ticket-centre';
import { TicketListView } from '../workflow/component/tickets/ticket-center/ticket-list-view/ticket-list-view';
import { TicketKanbanView } from '../workflow/component/tickets/ticket-center/ticket-kanban-view/ticket-kanban-view';

export const TicketRoutes: Routes = [
  // { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  {
    path: '',
    component: TicketCentre,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: TicketListView,
      },
      {
        path: 'kanban',
        component: TicketKanbanView,
      },
      { path: '**', redirectTo: 'list' },
    ],
  },
  { path: '**', redirectTo: 'tickets' },
];
