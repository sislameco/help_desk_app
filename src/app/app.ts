import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '@core/layout/services/layout.service';
import { PageLayout } from '@core/layout/enums/page-layout.enum';
import { ErrorLayout } from '@core/layout/pages/error-layout/error-layout';
import { AuthorizedLayout } from '@core/layout/pages/authorized-layout/authorized-layout';
import { UnauthorizedLayout } from '@core/layout/pages/unauthorized-layout/unauthorized-layout';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorLayout, AuthorizedLayout, UnauthorizedLayout, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  pageLayoutService = inject(LayoutService);
  layout = this.pageLayoutService.layout;
  protected readonly PageLayout = PageLayout;
}
