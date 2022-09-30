import { TransferType } from "@/types/transfer";
import { ApiPromise } from "@polkadot/api";

export const sendExtrinsic = async (
  api: any,
  to: string,
  amount: string,
  transferType: TransferType = "keepAlive"
) => {
  switch (transferType) {
    case "transfer":
      return (api as ApiPromise).tx.balances.transfer(to, amount);
    case "keepAlive":
      return (api as ApiPromise).tx.balances.transferKeepAlive(to, amount);
    case "all":
      return (api as ApiPromise).tx.balances.transferAll(to, false);
    case "allKeepAlive":
      return (api as ApiPromise).tx.balances.transferAll(to, true);
  }
};
