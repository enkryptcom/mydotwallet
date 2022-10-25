import { Account } from "@/types/account";

export enum StorageKeys {
  recentAccountsInfo = "recentAccountsInfo",
}

export interface IState {
  recentAccounts: Account[];
}
