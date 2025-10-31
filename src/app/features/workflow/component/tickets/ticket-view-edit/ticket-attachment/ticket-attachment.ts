import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { TicketFileDto } from '../../../../models/ticket.model.model';
import { Dropdown } from '@shared/helper/components/dropdown/dropdown';

@Component({
  selector: 'app-ticket-attachment',
  imports: [Dropdown],
  templateUrl: './ticket-attachment.html',
  styleUrl: './ticket-attachment.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TicketAttachment {
  attachments = input<TicketFileDto[]>([]);
  isCollapsed = signal(false);

  toggleCollapse() {
    this.isCollapsed.update((val) => !val);
  }

  uploadAttachment() {
    // console.log('Upload clicked');
  }
}
