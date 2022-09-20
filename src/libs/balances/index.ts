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

    const addresses = accounts.value.map((acc) => acc.address);

    const result =
      await api.query.system.account.multi<AccountInfoWithRefCount>(addresses);

    result.forEach((item, index) => {
      nativeBalances.value[addresses[index]] = Number(
        fromBase(item.data.free.toString(), api.registry.chainDecimals[0])
      );
    });
    isBalancesLoading.value = false;
  } catch (err) {
    isBalancesLoading.value = false;
    nativeBalances.value = {};
    console.error(err);
  }
};
