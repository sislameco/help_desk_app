import { inject } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyDto } from '../../models/company.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Component, ChangeDetectionStrategy, OnInit, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './company-detail.html',
  styleUrls: ['./company-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyDetail implements OnInit {
  private fb = inject(FormBuilder);
  private companyService = inject(CompanyService);
  private route = inject(ActivatedRoute);
  id = Number(this.route.snapshot.paramMap.get('id'));
  company!: CompanyDto;
  save = new EventEmitter<CompanyDto>();

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      shortName: ['', Validators.required],
      description: [''],
      accessKey: [''],
      secretKey: [''],
      prefixTicket: [''],
    });

    this.companyService.getCompanyById(this.id).subscribe((company) => {
      this.company = company;
      this.form.patchValue(company);
    });
  }

  submit() {
    if (this.form.valid) {
      const updated: CompanyDto = { ...this.company, ...this.form.value };

      this.companyService.updateCompany(this.id, updated).subscribe({
        next: (res) => {
          console.log('✅ Company updated successfully', res);
        },
        error: (err) => {
          console.error('❌ Failed to update company', err);
        },
      });
    }
  }
}
