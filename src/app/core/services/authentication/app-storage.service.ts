import { Injectable, Optional, SkipSelf } from '@angular/core';

interface StorageItem {
  key: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppStorage {

  private items: Array<StorageItem> = Array<StorageItem>();
  private appStorageKey = ['app_storage_items'];


  constructor(
    @Optional() @SkipSelf() prior: AppStorage,) {
    if (prior) { return prior; }
    this.loadItemsFromLocalStroge();
  }

  /**
   *
   * @param- key
   */
  get<T>(key: string): T {
    const item = this.items.find(items => items.key === key);
    if (!item) {
      return null;
    }
    return JSON.parse(item.value) as T;
  }

  /**
   *
   * @param- key
   * @param- value
   */
  save<T>(key: string, value: T): void {
    let isExist = false;
    const itemValue = JSON.stringify(value);
    this.items.map(item => {
      if (item.key === key) {
        isExist = true;
        item.value = itemValue;
      }
    })
    if (!isExist) {
      this.items.push({ key, value: itemValue });
    }
    this.saveItemsToLocalStorage();
  }

 
  clear(): void {
    this.appStorageKey.forEach(item => localStorage.removeItem(item));
    this.items = Array<StorageItem>();
  }


  private loadItemsFromLocalStroge(): void {
    const items = localStorage.getItem(this.appStorageKey[0]);
    this.items = JSON.parse(items) || [];
  }

  private saveItemsToLocalStorage(): void {
    const items = JSON.stringify(this.items);
    localStorage.setItem(this.appStorageKey[0], items);
  }

  public saveExtraItem(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  public getExtraItem(key: string) {
    return localStorage.getItem(key);
  }

  public removeExtraItem(key: string) {
    localStorage.removeItem(key);
  }

  public saveExtraItemSessionStorage(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  public getExtraItemSessionStorage(key: string) {
    return sessionStorage.getItem(key);
  }

  public removeExtraItemSessionStorage(key: string) {
    sessionStorage.removeItem(key);
  }

  public clearSessionStorage() {
    sessionStorage.clear();
  }
}
