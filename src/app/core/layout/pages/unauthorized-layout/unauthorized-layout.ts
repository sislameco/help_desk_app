import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized-layout',
  templateUrl: './unauthorized-layout.html',
  styleUrls: ['./unauthorized-layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorizedLayout {}
