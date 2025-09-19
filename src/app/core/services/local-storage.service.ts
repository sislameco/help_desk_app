import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  /**
   * Get item by key
   * - Tries to parse JSON if possible
   * - Returns `null` if not found
   */
  getItem<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    if (data === null) {
      return null;
    }

    try {
      return JSON.parse(data) as T;
    } catch {
      // fallback for plain strings or non-JSON values
      return data as unknown as T;
    }
  }

  /**
   * Set item by key
   * - Automatically stringifies objects/arrays
   * - Stores raw string if value is string
   */
  setItem<T>(key: string, value: T): void {
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  /**
   * Remove item by key
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all localStorage
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * Check if key exists
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
