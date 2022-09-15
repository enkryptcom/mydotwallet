import { InjectedExtension } from "@polkadot/extension-inject/types";
import type { Signer } from "@polkadot/api/types";
import { Account } from "./account";

export interface AppStore {
  accounts: Account[];
  extension?: InjectedExtension;
  signer?: Signer;
}
