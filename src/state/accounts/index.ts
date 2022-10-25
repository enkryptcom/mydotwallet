import BrowserStorage from "@/libs/storage/browser-storage";
import { Account } from "@/types/account";
import { IState, StorageKeys } from "./types";

class AccountsState {
  private storage: BrowserStorage;

  constructor() {
    this.storage = new BrowserStorage("AccountsState");
  }

  async getRecentAccounts(): Promise<Account[]> {
    const state: IState | undefined = await this.storage.get(
      StorageKeys.recentAccountsInfo
    );

    if (state && state.recentAccounts) {
      return state.recentAccounts;
    }

    return [];
  }

  async addRecentAccount(account: Account) {
    account = JSON.parse(JSON.stringify(account));

    const state: IState | undefined = await this.storage.get(
      StorageKeys.recentAccountsInfo
    );

    if (state && state.recentAccounts) {
      const recentAccounts = state.recentAccounts.filter(
        (acc) => acc.address !== account.address
      );

      const newState: IState = {
        recentAccounts: [account, ...recentAccounts],
      };

      await this.storage.set(StorageKeys.recentAccountsInfo, newState);
    } else {
      const newState: IState = {
        recentAccounts: [account],
      };

      await this.storage.set(StorageKeys.recentAccountsInfo, newState);
    }
  }
}

export default AccountsState;
