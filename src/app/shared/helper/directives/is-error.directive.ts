import { Directive, Input, OnInit, OnDestroy, ElementRef, Renderer2, inject } from '@angular/core';
import { AbstractControl, FormGroupDirective } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appIsError]',
  standalone: true,
})
export class IsErrorDirective implements OnInit, OnDestroy {
  @Input('appIsError') control!: AbstractControl | null;

  private destroy$ = new Subject<void>();
  private focusOutUnlistener?: () => void;
  private focusInUnlistener?: () => void;
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private formGroupDir = inject(FormGroupDirective);

  ngOnInit(): void {
    if (!this.control) {
      // helpful for debugging if you accidentally passed the wrong value
      // console.warn('IsErrorDirective: no control provided for', this.el.nativeElement);
      return;
    }

    // --- Subscriptions ---
    // watch control status changes
    if (this.control.statusChanges) {
      this.control.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateClass());
    }

    // watch form submit
    this.formGroupDir.ngSubmit.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateClass());

    // --- DOM Event Listeners ---
    // LISTEN FOR focusout (bubbles from child inputs) instead of blur on container
    // mark the control touched (ensures control.touched is true on first blur)
    this.focusOutUnlistener = this.renderer.listen(this.el.nativeElement, 'focusout', () => {
      this.control!.markAsTouched();
      this.updateClass();
    });

    // optional: re-evaluate on focusin (keeps class in sync while user focuses)
    this.focusInUnlistener = this.renderer.listen(this.el.nativeElement, 'focusin', () => {
      this.updateClass();
    });

    // --- Initial State ---
    this.updateClass();
  }

  private updateClass(): void {
    if (!this.control) {
      return;
    }

    const hasError = this.control.invalid && (this.control.touched || this.formGroupDir.submitted);

    if (hasError) {
      this.renderer.addClass(this.el.nativeElement, 'error');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'error');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.focusOutUnlistener?.();
    this.focusInUnlistener?.();
  }
}
