import { encodeAddress } from "@polkadot/util-crypto";

export const encodeSubstrateAddress = (address?: string) => {
  try {
    if (address) {
      return encodeAddress(address || "");
    }
  } catch {
    return undefined;
  }
};
