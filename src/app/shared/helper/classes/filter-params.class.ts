/* filter-params.class.ts */
import { signal, computed, WritableSignal } from '@angular/core';

function normalizeValue<T>(value: T): T {
  if (typeof value === 'string') {
    if (!isNaN(Number(value)) && value.trim() !== '') {
      return Number(value) as unknown as T;
    }
    if (value === 'true') {
      return true as unknown as T;
    }
    if (value === 'false') {
      return false as unknown as T;
    }
  }
  return value;
}
/**
 * Strongly-typed, signal-based query/filter manager for Angular zoneless apps.
 *
 * This class encapsulates filter/query parameters in a reactive, OOP-style API.
 */
export class FilterParams<T extends object> {
  private readonly _filterData: WritableSignal<T>;
  private readonly _initial: T;

  readonly value = computed(() => this._filterData());

  constructor(initial: T) {
    this._initial = { ...initial };
    this._filterData = signal({ ...initial });
  }

  set<K extends keyof T>(key: K, value: T[K]): this {
    const normValue = normalizeValue(value);
    const current = this._filterData();
    if (current[key] === normValue) {
      return this;
    }
    this._filterData.set({ ...current, [key]: normValue });
    return this;
  }

  setMany(values: Partial<T>): this {
    const current = this._filterData();
    const updated = { ...current };
    let changed = false;
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        const k = key as keyof T;
        let value = values[k];
        if (value === null || value === undefined) {
          continue;
        }
        value = normalizeValue(value);
        if (current[k] !== value) {
          updated[k] = value as T[keyof T];
          changed = true;
        }
      }
    }
    if (changed) {
      this._filterData.set(updated);
    }
    return this;
  }

  remove<K extends keyof T>(key: K): this {
    const current = this._filterData();
    if (!(key in current)) {
      return this;
    }
    const updated = { ...current } as T;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    delete (updated as unknown)[key];
    this._filterData.set(updated);
    return this;
  }

  /**
   * Reset: required keys to initial value, optional keys to undefined.
   */
  reset(): this {
    const resetObj = { ...this._initial };
    (Object.keys(this._initial) as (keyof T)[]).forEach((key) => {
      if (this._initial[key] === undefined) {
        resetObj[key] = undefined as T[keyof T];
      }
    });
    this._filterData.set(resetObj);
    return this;
  }

  clear(): this {
    return this.reset();
  }

  fromQueryParams(params: Partial<T>): this {
    return this.setMany(params);
  }
  /** Export filters to query params (stringified) */
  toQueryParams(): Record<string, string> {
    const current = this._filterData();
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(current)) {
      if (value !== undefined && value !== null && value !== '') {
        result[key] = String(value);
      }
    }
    return result;
  }

  /** Check if a key has a defined value */
  has<K extends keyof T>(key: K): boolean {
    return this._filterData()[key] !== undefined;
  }
}
