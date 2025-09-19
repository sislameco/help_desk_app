import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonDesign } from './button-design/button-design';
import { FormDesignComponent } from './form-design-component/form-design-component';
import { DemoTableDesign } from './demo-table-design/demo-table-design';

@Component({
  selector: 'app-demos',
  imports: [ButtonDesign, FormDesignComponent, DemoTableDesign],
  templateUrl: './demos.html',
  styleUrl: './demos.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Demos {}
