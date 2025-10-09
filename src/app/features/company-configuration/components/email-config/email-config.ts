import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { EmailConfigurationService } from '../../services/email-configuration.service';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  EmailConfigInputDto,
  EmailConfigurationOutput,
} from '../../models/email-configuration-model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-email-config',
  imports: [NgSelectModule, BsDropdownModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './email-config.html',
  styleUrl: './email-config.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfig implements OnInit {
  private emailService = inject(EmailConfigurationService);
  private fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService); // or inject(AlertService)
  private route = inject(ActivatedRoute);
  emailConfigs = signal<EmailConfigurationOutput[]>([]);
  form!: FormGroup;
  selectedId: number | null = null;
  companyId = Number(this.route.snapshot.paramMap.get('id')); // ⬅️ Replace with dynamic company ID if needed

  ngOnInit(): void {
    this.initForm();
    this.loadEmailConfigs();
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [0],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      host: ['', Validators.required],
      smtpPort: [587, Validators.required],
      imapPort: [993],
      accessKey: [''],
      secretKey: [''],
      bcc: [''],
      isDefault: [false],
      name: ['', Validators.required],
    });
  }

  loadEmailConfigs(): void {
    this.emailService.getAllActiveByCompanyId(this.companyId).subscribe({
      next: (res) => this.emailConfigs.set(res),
      error: (err) => this.toastr.error('Failed to load email configurations', err.message),
    });
  }

  edit(config: EmailConfigurationOutput): void {
    this.selectedId = config.id;
    this.form.patchValue(config);
  }

  save(): void {
    if (this.form.invalid) {
      this.toastr.warning('Please fill all required fields');
      return;
    }

    const input: EmailConfigInputDto = this.form.value;
    input.id = this.selectedId || 0;
    this.emailService.updateFields(input).subscribe({
      next: () => {
        this.toastr.success('Email configuration updated');
        this.loadEmailConfigs();
        this.resetForm();
      },
      error: (err) => this.toastr.error('Failed to update', err.message),
    });
  }

  setDefault(id: number): void {
    this.emailService.setDefault(id).subscribe({
      next: () => {
        this.toastr.success('Default email configuration set');
        this.loadEmailConfigs();
      },
      error: (err) => this.toastr.error('Failed to set default', err.message),
    });
  }

  resetForm(): void {
    this.form.reset();
    this.selectedId = null;
  }
}
