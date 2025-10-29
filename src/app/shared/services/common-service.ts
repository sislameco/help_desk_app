import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  isFullScreenMode = new Subject<boolean>();
  isBatchEditMode = new Subject<boolean>();
  importAllSupplierProducts = new Subject<boolean>();
  isImportProducts = new Subject<boolean>();
  isSidebarToggle = new Subject<boolean>();
}
