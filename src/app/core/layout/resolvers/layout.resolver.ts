import { ResolveFn } from '@angular/router';
import { PageLayout } from '../enums/page-layout.enum';
import { inject } from '@angular/core';
import { LayoutService } from '../services/layout.service';

export const layoutResolver = (inputLayout: PageLayout): ResolveFn<void> => {
  return () => {
    inject(LayoutService).setLayout(inputLayout);
  };
};
