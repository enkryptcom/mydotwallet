import { nativeToken } from "@/stores";
import { GasFeeInfo } from "@/types/transaction";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import BigNumber from "bignumber.js";
import { fromBase } from "./units";

export const getGasFeeInfo = async (
  transaction: SubmittableExtrinsic<"promise", ISubmittableResult>,
  signerAccount: string
): Promise<GasFeeInfo> => {
  const { partialFee } = (
    await transaction.paymentInfo(signerAccount)
  ).toJSON();

  const txFeeHuman = new BigNumber(
    fromBase(partialFee?.toString() ?? "", nativeToken.value.decimals)
  );

  const txPrice = new BigNumber(nativeToken.value.price).times(txFeeHuman);

  return {
    fiatSymbol: "USD",
    fiatValue: txPrice,
    nativeSymbol: nativeToken.value.symbol ?? "",
    nativeValue: txFeeHuman,
  };
};
