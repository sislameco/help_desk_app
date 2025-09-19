import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HighlightAuto } from 'ngx-highlightjs';

@Component({
  selector: 'app-form-design-component',
  imports: [NgSelectModule, BsDropdownModule, HighlightAuto],
  templateUrl: './form-design-component.html',
  styleUrl: './form-design-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDesignComponent {
  switchBtn = `
   <div class="switch-wrapper">
    <input type="checkbox" id="isCommissionRole" class="d-none" />
    <label for="isCommissionRole" class="switch">Is Commission Role</label>
  </div>
   `;

  checkbox = `
    <label class="custom-checkbox">
      <input type="checkbox" />
      <span></span>
    </label>
   `;
}
