import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CompanyService } from '../../services/company.service';
import { CompanyDto } from '../../models/company.model';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-list.html',
  styleUrls: ['./company-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyList {
  private router = inject(Router);
  private companyService = inject(CompanyService);
  // ✅ signal for active companies
  companies = toSignal(this.companyService.getActiveCompanies(), {
    initialValue: [] as CompanyDto[],
  });
  selectCompany(company: CompanyDto) {
    this.router.navigate(['/pages/company-configuration', company.id], { state: { company } });
  }
}
