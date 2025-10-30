import { AbstractControl } from '@angular/forms';
import { computed, signal, Signal, WritableSignal } from '@angular/core';

// Generic reusable logic with strong typing
export function setupIsDefaultHandler<
  T extends {
    get: (key: string) => AbstractControl | null;
    controls: Record<string, AbstractControl>;
  },
>(
  fieldGroup: T,
  controlKeys: (keyof T['controls'])[],
  isDefaultHandlers: WeakMap<T, (value: boolean) => void>,
): void {
  const initialControlStates = new Map<keyof T['controls'], boolean>();

  // Save initial enabled/disabled states
  for (const key of controlKeys) {
    const control = fieldGroup.get(key as string);
    if (control) {
      initialControlStates.set(key, control.enabled);
    }
  }

  const updateFieldGroupControls = (value: boolean) => {
    for (const key of controlKeys) {
      const control = fieldGroup.get(key as string);
      if (!control) {
        continue;
      }

      const shouldBeEnabled = initialControlStates.get(key);
      if (value) {
        if (shouldBeEnabled) {
          control.enable({ emitEvent: false });
        } else {
          control.disable({ emitEvent: false });
        }
      } else {
        control.disable({ emitEvent: false });
        control.setValue(false, { emitEvent: false });
      }
    }
  };

  // Keep handler reference for future if needed
  isDefaultHandlers.set(fieldGroup, updateFieldGroupControls);

  // Subscribe to "isDefault" changes
  fieldGroup.get('inProduct')?.valueChanges.subscribe((value: boolean) => {
    updateFieldGroupControls(value);
  });

  // Run initially
  updateFieldGroupControls(fieldGroup.get('inProduct')?.value ?? false);
}

export function createToggleList<T>(
  source: Signal<T[]>,
  limit = 5,
): {
  readonly visible: Signal<T[]>;
  readonly title: Signal<string | null>;
  readonly toggle: () => void;
  readonly showAll: WritableSignal<boolean>;
} {
  const showAll = signal(false);

  const visible = computed(() => (showAll() ? source() : source().slice(0, limit)));

  const title = computed(() =>
    source().length > limit ? (showAll() ? 'See Less' : 'See More') : null,
  );

  const toggle = () => showAll.update((v) => !v);

  return { visible, title, toggle, showAll };
}

export interface PriceRange {
  min: number;
  max: number;
}

/**
 * Generates price ranges for filtering
 * @param min Minimum price (default: 0)
 * @param max Maximum price (default: 5000)
 * @param slotCount Number of price slots to generate (default: 5)
 * @returns Array of price ranges
 */
export function generatePriceRanges(
  min: number = 0,
  max: number = 5000,
  slotCount = 5,
): PriceRange[] {
  const roundedMin = Math.floor(min);
  const roundedMax = Math.ceil(max);
  const totalRange = roundedMax - roundedMin;

  // Prevent generating invalid or redundant ranges
  if (totalRange <= 1 || isNaN(totalRange)) {
    return [];
  }

  // Divide the range into slots
  const slotSize = Math.ceil(totalRange / slotCount);
  const result: PriceRange[] = [];

  for (let i = 0; i < slotCount; i++) {
    const rangeMin = roundedMin + i * slotSize;
    let rangeMax = rangeMin + slotSize - 1;

    // Ensure the last range ends exactly at roundedMax
    if (i === slotCount - 1) {
      rangeMax = roundedMax;
    }

    // Push only ranges with valid min and max values
    if (rangeMin < rangeMax) {
      result.push({ min: rangeMin, max: rangeMax });
    }
  }

  return result;
}
