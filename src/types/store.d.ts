import { InjectedExtension } from "@polkadot/extension-inject/types";
import type { Signer } from "@polkadot/api/types";

export interface AppStore {
  accounts: string[];
  extension?: InjectedExtension;
  signer?: Signer;
}
