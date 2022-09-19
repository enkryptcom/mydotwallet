import {
  accounts,
  apiPromise,
  isBalancesLoading,
  nativeBalances,
} from "@/stores";
import { AccountInfoWithRefCount } from "@polkadot/types/interfaces";
import { fromBase } from "../utils/units";

export const useGetBalances = async () => {
  try {
    isBalancesLoading.value = true;
    const api = await apiPromise.value;

    const activeBalancePromises = accounts.value.map((acc) => {
      return api.query.system.account<AccountInfoWithRefCount>(acc.address);
    });
    const result = await Promise.all(activeBalancePromises);

    nativeBalances.value = result.map((item) => {
      return Number(
        fromBase(item.data.free.toString(), api.registry.chainDecimals[0])
      );
    });

    isBalancesLoading.value = false;
  } catch (err) {
    isBalancesLoading.value = false;
    nativeBalances.value = [];
    console.error(err);
  }
};
