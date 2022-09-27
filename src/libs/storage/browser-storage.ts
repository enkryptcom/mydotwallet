import Storage from "./storage";
import { BrowserStorageArea } from "@/types/storage";

class BrowserStorage extends Storage {
  constructor(namespace: string, storage?: BrowserStorageArea) {
    super(namespace, { storage });
  }
}

export default BrowserStorage;
