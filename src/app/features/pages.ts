import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-pages',
  imports: [RouterOutlet],
  templateUrl: './pages.html',
  styleUrl: './pages.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pages {}
