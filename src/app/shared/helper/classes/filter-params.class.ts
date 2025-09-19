/* filter-params.class.ts */
import { signal, computed, WritableSignal } from '@angular/core';

/**
 * A generic object map type for filter/query parameters.
 */
export type ObjectMap<T = string | number | boolean | undefined> = Record<string, T>;

/**
 * Strongly-typed, signal-based query/filter manager for Angular zoneless apps.
 *
 * This class encapsulates filter/query parameters in a reactive, OOP-style API.
 */
export class FilterParams<T extends ObjectMap = ObjectMap> {
  private readonly _filterData: WritableSignal<T>;

  /** Reactive readonly signal exposing the current filter state */
  readonly value = computed(() => this._filterData());

  /**
   * Create a new `FilterParams` instance.
   *
   * @param initial - Initial filter values.
   */
  constructor(initial: T = {} as T) {
    this._filterData = signal({ ...initial });
  }

  /** Get snapshot of current state */
  snapshot(): T {
    return { ...this._filterData() };
  }

  /** Set a single filter key */
  set<K extends keyof T>(key: K, value: T[K]): this {
    const current = this._filterData();
    if (current[key] === value) {
      return this;
    }
    this._filterData.set({ ...current, [key]: value });
    return this;
  }

  /** Bulk update multiple filter values */
  setMany(values: Partial<T>): this {
    const current = this._filterData();
    const updated = { ...current };
    let changed = false;

    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        const k = key as keyof T;
        if (current[k] !== values[k]) {
          updated[k] = values[k]!;
          changed = true;
        }
      }
    }

    if (changed) {
      this._filterData.set(updated);
    }
    return this;
  }

  /** Remove a filter key completely */
  remove<K extends keyof T>(key: K): this {
    const currentObj = { ...this._filterData() };
    if (!(key in currentObj)) {
      return this;
    }
    delete currentObj[key];
    this._filterData.set(currentObj);
    return this;
  }

  /** Reset all existing keys to undefined */
  reset(): this {
    const empty = Object.keys(this._filterData()).reduce((acc, key) => {
      acc[key as keyof T] = undefined as T[keyof T];
      return acc;
    }, {} as T);
    this._filterData.set(empty);
    return this;
  }

  /** Load filters from query params */
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

  /** Clear all filters (remove all keys) */
  clear(): this {
    this._filterData.set({} as T);
    return this;
  }
}
