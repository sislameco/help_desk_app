import { Routes } from '@angular/router';
import { TicketCentre } from '../workflow/component/tickets/ticket-center/ticket-centre';
import { TicketViewEdit } from './component/tickets/ticket-view-edit/ticket-view-edit';

export const TicketRoutes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: TicketCentre },
  { path: ':ticketId', component: TicketViewEdit },
  { path: '**', redirectTo: 'list' },
];
