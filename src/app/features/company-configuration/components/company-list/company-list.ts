import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  private companyService = inject(CompanyService);

  // ✅ signal for active companies
  companies = toSignal(this.companyService.getActiveCompanies(), {
    initialValue: [] as CompanyDto[],
  });
}
