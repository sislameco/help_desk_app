import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { derivedAsync } from 'ngxtension/derived-async';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly refresh = signal(0);

  protected readonly ticketSummary = derivedAsync(() => this.dashboardService.getTicketSummary());

  private readonly dashboardService = inject(DashboardService);

  reload() {
    this.refresh.update((v) => v + 1);
  }
}
