import { ChangeDetectionStrategy, Component, input, signal, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDto } from '../../models/company.model';
import { TabConfig, tabs } from '../../models/data-config.model';
import { CompanyDetail } from '../company-detail/company-detail';

@Component({
  selector: 'app-company-setting',
  standalone: true, // ✅ standalone true
  imports: [CommonModule],
  templateUrl: './company-setting.html',
  styleUrls: ['./company-setting.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanySetting {
  company = input<CompanyDto | null>(null);
  constructor() {}
  tabs = signal<TabConfig[]>(tabs);

  // ✅ Default tab
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeTab = signal<Type<unknown>>(CompanyDetail);

  selectTab(tab: TabConfig) {
    this.activeTab.set(tab.component);
  }
}
