/* eslint-disable no-console */
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CustomFieldDto } from '../../models/data-config.model';
import { CustomDefineDataSourceService } from '../../services/custom-define-data-source.service';

@Component({
  selector: 'app-custom-define-data-source',
  imports: [],
  templateUrl: './custom-define-data-source.html',
  styleUrl: './custom-define-data-source.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDefineDataSourceComponent implements OnInit {
  private service = inject(CustomDefineDataSourceService);

  fields: CustomFieldDto[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadFields();
  }

  loadFields() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (res) => {
        this.fields = res;
        this.loading = false;
      },

      error: (err) => {
        console.error('Failed to load fields', err);
        this.loading = false;
      },
    });
  }

  deleteField(id: number | undefined) {
    if (!id) {
      return;
    }
    if (confirm('Are you sure you want to delete this field?')) {
      this.service.delete(id).subscribe(() => {
        this.fields = this.fields.filter((f) => f.id !== id);
      });
    }
  }

  addField() {
    // 👉 later you can open modal for create field
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  editField(field: CustomFieldDto) {}
}
