export enum InternalStorageNamespace {
  cacheFetch = "CacheFetch",
  marketData = "MarketData",
}

export interface BrowserStorageArea {
  get(
    keys?: null | string | string[] | Record<string, any>
  ): Promise<Record<string, any>>;
  set(items: Record<string, any>): Promise<void>;
  remove(keys: string | string[]): Promise<void>;
  clear(): Promise<void>;
}

export interface StorageOptions {
  storage?: BrowserStorageArea;
}
