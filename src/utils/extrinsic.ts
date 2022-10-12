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

export const stakeExtrinsic = async (
  api: any,
  address: string,
  amount: string
) => {
  if (api.tx.utility.batchAll) {
    return api.tx.utility.batchAll([
      api.tx.staking.bond(address, amount, { Account: address }),
      api.tx.staking.nominate([]),
    ]);
  } else {
    return api.tx.utility.batch([
      api.tx.staking.bond(address, amount, { Account: address }),
      api.tx.staking.nominate([]),
    ]);
  }
};
