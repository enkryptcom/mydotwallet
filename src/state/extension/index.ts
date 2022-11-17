import BrowserStorage from "@/libs/storage/browser-storage";
import { IState, StorageKeys } from "./types";

class LastExtensionState {
  private storage: BrowserStorage;

  constructor() {
    this.storage = new BrowserStorage("ExtensionState");
  }

  async setLastExtension(extensionName: string) {
    const newState: IState = {
      lastExtension: extensionName,
    };

    await this.storage.set(StorageKeys.extensionInfo, newState);
  }

  async getLastExtensionName(): Promise<string | null> {
    const state: IState | undefined = await this.storage.get(
      StorageKeys.extensionInfo
    );
    if (state && state.lastExtension) {
      return state.lastExtension;
    }

    return null;
  }

  async clearLastExtension() {
    this.storage.remove(StorageKeys.extensionInfo);
  }
}

export default LastExtensionState;
