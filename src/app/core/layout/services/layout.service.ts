import { Injectable, signal } from '@angular/core';
import { PageLayout } from '../enums/page-layout.enum';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  public layout = signal<PageLayout | undefined>(undefined);
  setLayout(value: PageLayout) {
    this.layout.set(value);
  }
}
