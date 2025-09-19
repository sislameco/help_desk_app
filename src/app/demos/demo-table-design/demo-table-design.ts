import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-demo-table-design',
  imports: [NgSelectModule, BsDropdownModule],
  templateUrl: './demo-table-design.html',
  styleUrl: './demo-table-design.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoTableDesign {}
