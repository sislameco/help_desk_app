import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Search {
  searchControl = new FormControl('');
  searchText = signal('');
  searchString = output<string>();
  private route = inject(ActivatedRoute);
  constructor() {
    // 🔍 Emit search value changes (debounced)
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => this.searchString.emit(value ?? ''));

    // 🔗 Sync with query params
    this.route.queryParams.subscribe((params) => {
      const search = params['search'] ?? '';
      this.searchText.set(search);
      this.searchControl.setValue(search, { emitEvent: false });
    });
  }
  clearSearch() {
    this.searchText.set('');
    this.searchControl.setValue('');
  }
}
