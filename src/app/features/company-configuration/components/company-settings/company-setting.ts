import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompanyDto } from '../../models/company.model';
import { TabConfig, tabs } from '../../models/data-config.model';

@Component({
  selector: 'app-company-setting',
  standalone: true, // ✅ standalone true
  imports: [CommonModule, RouterModule],
  templateUrl: './company-setting.html',
  styleUrls: ['./company-setting.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanySetting {
  company = input<CompanyDto | null>(null);
  constructor() {}
  tabs = signal<TabConfig[]>(tabs);
}
