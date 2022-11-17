import { TransferType } from "@/types/transfer";
import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ParaId } from "@polkadot/types/interfaces";
import { ISubmittableResult } from "@polkadot/types/types";

export const sendExtrinsic = async (
  api: any,
  to: string,
  amount: string,
  transferType: TransferType = "keepAlive"
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>> => {
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
  amount: string,
  nominating: string[],
  isCompounding: boolean
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>> => {
  return api.tx.utility.batchAll
    ? api.tx.utility.batchAll([
        api.tx.staking.bond(
          address,
          amount,
          isCompounding ? "Staked" : "Stash"
        ),
        api.tx.staking.nominate(nominating),
      ])
    : api.tx.utility.batch([
        api.tx.staking.bond(
          address,
          amount,
          isCompounding ? "Staked" : "Stash"
        ),
        api.tx.staking.nominate(nominating),
      ]);
};

export const stakeExtraExtrinsic = async (
  api: any,
  amount: string,
  nominating: string[],
  isCompounding: boolean
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>> => {
  return api.tx.utility.batchAll
    ? api.tx.utility.batchAll([
        api.tx.staking.setPayee(isCompounding ? "Staked" : "Stash"),
        api.tx.staking.bondExtra(amount),
        api.tx.staking.nominate(nominating),
      ])
    : api.tx.utility.batch([
        api.tx.staking.setPayee(isCompounding ? "Staked" : "Stash"),
        api.tx.staking.bondExtra(amount),
        api.tx.staking.nominate(nominating),
      ]);
};

export const unbondExtrinsic = async (
  api: any,
  amount: string
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>> => {
  return api.tx.staking.unbond(amount);
};

export const withdrawExtrinsic = async (
  api: any,
  numberOfSpans = 0
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>> => {
  return api.tx.staking.withdrawUnbonded(numberOfSpans);
};

export const crowdloanContributeExtrinsic = async (
  api: any,
  paraId: ParaId,
  amount: string,
  multiSignature?: string
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>> => {
  return api.tx.crowdloan.contribute(paraId, amount, multiSignature);
};

export const crowdloanRefundExtrinsic = async (
  api: any,
  paraId: ParaId
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>> => {
  return api.tx.crowdloan.refund(paraId);
};
