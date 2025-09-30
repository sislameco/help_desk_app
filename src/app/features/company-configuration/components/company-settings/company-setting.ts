import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { CompanyDto } from '../../models/company.model';

@Component({
  selector: 'app-company-setting',
  standalone: true, // ✅ standalone true
  imports: [CommonModule, RouterModule],
  templateUrl: './company-setting.html',
  styleUrls: ['./company-setting.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanySetting {
  private route = inject(ActivatedRoute);
  private companyService = inject(CompanyService);

  companyId = signal<number>(0);
  company = signal<CompanyDto | null>(null);

  constructor() {
    // read route param
    this.companyId.set(Number(this.route.snapshot.paramMap.get('id')));

    // load company info
    this.companyService.getActiveCompanies().subscribe((companies) => {
      const found = companies.find((c) => c.id === this.companyId());
      this.company.set(found || null);
    });
  }
}
