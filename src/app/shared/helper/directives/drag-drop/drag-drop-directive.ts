import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: '[appDragDropDirective]',
})
export class DragDropDirective {
  readonly dragging = output<boolean>();

  fileDropped = output<File>();

  @HostListener('dragover', ['$event'])
  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragging.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragging.emit(false);
  }

  @HostListener('drop', ['$event'])
  onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragging.emit(false);
    if (evt.dataTransfer?.files.length) {
      const file = evt.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        this.fileDropped.emit(file);
      }
    }
  }
}
