import {
  accounts,
  apiPromise,
  isBalancesLoading,
  nativeBalances,
} from "@/stores";
import { DeriveUnlocking } from "@polkadot/api-derive/types";
import { fromBase } from "../utils/units";
import { BN, BN_ONE, BN_ZERO } from "@polkadot/util";

export const useGetNativeBalances = async () => {
  try {
    isBalancesLoading.value = true;
    const api = await apiPromise.value;

    const addresses = accounts.value.map((acc) => acc.address);

    const balanceResult = await Promise.all(
      addresses.map((addr) => {
        return api.derive.balances.all(addr);
      })
    );

    const stakingResult = await Promise.all(
      addresses.map((addr) => {
        return api.derive.staking.account(addr);
      })
    );

    const unboundProgress = await api.derive.session.progress();

    addresses.forEach((item, index) => {
      nativeBalances.value[accounts.value[index].address] = {
        free: fromBase(
          balanceResult[index].freeBalance.toString(),
          api.registry.chainDecimals[0]
        ),
        available: fromBase(
          balanceResult[index].availableBalance.toString(),
          api.registry.chainDecimals[0]
        ),
        locked: fromBase(
          balanceResult[index].lockedBalance.toString(),
          api.registry.chainDecimals[0]
        ),
        reserved: fromBase(
          balanceResult[index].reservedBalance.toString(),
          api.registry.chainDecimals[0]
        ),
        vested: fromBase(
          balanceResult[index].vestedBalance.toString(),
          api.registry.chainDecimals[0]
        ),
        total: fromBase(
          balanceResult[index].freeBalance
            .add(balanceResult[index].reservedBalance)
            .toString(),
          api.registry.chainDecimals[0]
        ),
        bonded:
          stakingResult[index] &&
          stakingResult[index].stakingLedger &&
          stakingResult[index].stakingLedger.active &&
          stakingResult[index].accountId.eq(stakingResult[index].stashId)
            ? fromBase(
                stakingResult[index].stakingLedger.active.unwrap(),
                api.registry.chainDecimals[0]
              )
            : "0",
        redeemable: fromBase(
          stakingResult[index].redeemable?.toString() || "0",
          api.registry.chainDecimals[0]
        ),
        unbounding:
          !stakingResult[index].unlocking || !unboundProgress
            ? "0"
            : fromBase(
                (stakingResult[index].unlocking as DeriveUnlocking[])
                  .filter(
                    ({ remainingEras, value }) =>
                      value.gt(BN_ZERO) && remainingEras.gt(BN_ZERO)
                  )
                  .map((unlock): [any, BN, BN] => [
                    unlock,
                    unlock.remainingEras,
                    unlock.remainingEras
                      .sub(BN_ONE)
                      .imul(unboundProgress.eraLength)
                      .iadd(unboundProgress.eraLength)
                      .isub(unboundProgress.eraProgress),
                  ])
                  .reduce((total, [{ value }]) => total.iadd(value), new BN(0))
                  .toString(),
                api.registry.chainDecimals[0]
              ),
      };
    });

    isBalancesLoading.value = false;
  } catch (err) {
    isBalancesLoading.value = false;
    nativeBalances.value = {};
    console.error(err);
  }
};
