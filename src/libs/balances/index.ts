import {
  accounts,
  apiPromise,
  clearNativeBalances,
  isBalancesLoading,
  nativeBalances,
} from "@/stores";
import {
  DeriveBalancesAll,
  DeriveSessionProgress,
  DeriveStakingAccount,
} from "@polkadot/api-derive/types";
import { fromBase } from "../../utils/units";
import BigNumber from "bignumber.js";
import { extractUnbondingData } from "@/utils/staking";

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

    const unbondProgress = await api.derive.session.progress();

    const expectedBlockTime = Number(
      api.consts?.babe?.expectedBlockTime?.toString() || 6000
    );
    const lastBlock = await api.rpc.chain.getHeader();
    const lastBlockNumber = lastBlock.number.toNumber();

    addresses.forEach((_, index) => {
      // Set balance values to store
      nativeBalances[accounts.value[index].address] = buildBalanceFromResults(
        balanceResult[index],
        stakingResult[index],
        unbondProgress,
        expectedBlockTime,
        lastBlockNumber,
        api.registry.chainDecimals[0]
      );
    });

    isBalancesLoading.value = false;
  } catch (err) {
    isBalancesLoading.value = false;
    clearNativeBalances();
    console.error(err);
  }
};

export const useGetAccountNativeBalance = async (address: string) => {
  try {
    isBalancesLoading.value = true;
    const api = await apiPromise.value;

    const balanceResult = await api.derive.balances.all(address);

    const stakingResult = await api.derive.staking.account(address);

    const unbondProgress = await api.derive.session.progress();

    const expectedBlockTime = Number(
      api.consts?.babe?.expectedBlockTime?.toString() || 6000
    );
    const lastBlock = await api.rpc.chain.getHeader();
    const lastBlockNumber = lastBlock.number.toNumber();

    // Set balance values to store
    nativeBalances[address] = buildBalanceFromResults(
      balanceResult,
      stakingResult,
      unbondProgress,
      expectedBlockTime,
      lastBlockNumber,
      api.registry.chainDecimals[0]
    );

    isBalancesLoading.value = false;
  } catch (err) {
    isBalancesLoading.value = false;
    delete nativeBalances[address];
    console.error(err);
  }
};

const buildBalanceFromResults = (
  balanceResult: DeriveBalancesAll,
  stakingResult: DeriveStakingAccount,
  unbondProgress: DeriveSessionProgress,
  expectedBlockTime: number,
  lastBlockNumber: number,
  decimals: number
) => {
  // Calculate vesting end
  const vestingEndBlock = balanceResult.vesting.reduce((prev, current) => {
    return current.endBlock.toNumber() > prev
      ? current.endBlock.toNumber()
      : prev;
  }, 0);
  const timeToEnd = (vestingEndBlock - lastBlockNumber) * expectedBlockTime;

  const [unbondList, unbondTotal] = extractUnbondingData(
    stakingResult.unlocking,
    unbondProgress,
    expectedBlockTime
  );

  return {
    free: new BigNumber(
      fromBase(balanceResult.freeBalance.toString(), decimals)
    ),
    available: new BigNumber(
      fromBase(balanceResult.availableBalance.toString(), decimals)
    ),
    locked: new BigNumber(
      fromBase(balanceResult.lockedBalance.toString(), decimals)
    ),
    reserved: new BigNumber(
      fromBase(balanceResult.reservedBalance.toString(), decimals)
    ),
    vested: new BigNumber(
      fromBase(balanceResult.vestedBalance.toString(), decimals)
    ),
    vestingEndBlock: vestingEndBlock > lastBlockNumber ? vestingEndBlock : 0,
    vestingEndMillisecondsLeft:
      vestingEndBlock > lastBlockNumber ? timeToEnd : 0,
    total: new BigNumber(
      fromBase(
        balanceResult.freeBalance.add(balanceResult.reservedBalance).toString(),
        decimals
      )
    ),
    staked:
      stakingResult &&
      stakingResult.stakingLedger &&
      stakingResult.stakingLedger.active &&
      stakingResult.accountId.eq(stakingResult.stashId)
        ? new BigNumber(
            fromBase(stakingResult.stakingLedger.active.unwrap(), decimals)
          )
        : new BigNumber(0),
    redeemable: new BigNumber(
      fromBase(stakingResult.redeemable?.toString() || "0", decimals)
    ),
    unbonding: unbondTotal,
    unbondingList: unbondList,
    bonded: unbondTotal.plus(
      fromBase(stakingResult?.redeemable?.toString() || "0", decimals)
    ),
  };
};
