import { Storage } from "@ionic/storage";

class StorageService {
  private storage: Storage | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    const newStorage = new Storage();
    this.storage = await newStorage.create();
  }

  // Save an object or value to storage
  public async setItem<T>(key: string, value: T): Promise<void> {
    if (this.storage) {
      await this.storage.set(key, value);
    }
  }

  // Load an object or value from storage
  public async getItem<T>(key: string): Promise<T | null> {
    if (this.storage) {
      const value = await this.storage.get(key);
      return value as T | null;
    }
    return null;
  }

  // Remove an item from storage
  public async removeItem(key: string): Promise<void> {
    if (this.storage) {
      await this.storage.remove(key);
    }
  }

  // Clear all items in storage
  public async clear(): Promise<void> {
    if (this.storage) {
      await this.storage.clear();
    }
  }
}

export default new StorageService();
