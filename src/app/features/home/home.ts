import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from './dashboard.service';
import { derivedAsync } from 'ngxtension/derived-async';
import { Breadcrumbs } from '@shared/helper/components/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Breadcrumbs],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly refresh = signal(0);
  activeTab: 'workload' | 'performance' | 'trends' = 'workload';
  private readonly dashboardService = inject(DashboardService);

  protected readonly ticketSummary = derivedAsync(() => {
    this.refresh();
    return this.dashboardService.getTicketSummary();
  });

  reload() {
    this.refresh.update((v: number) => v + 1);
  }
}
