import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-ticket-list-view',
  imports: [CommonModule],
  templateUrl: './ticket-list-view.html',
  styleUrl: './ticket-list-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketListView {}
