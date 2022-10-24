import { isPricesLoading, nativeBalances, nativeToken } from "@/stores";
import BigNumber from "bignumber.js";
import MarketData from "../market-data";

export const useGetNativePrice = async () => {
  try {
    isPricesLoading.value = true;
    const marketData = new MarketData();
    const result = await marketData.getMarketData([
      nativeToken.value.coingeckoID,
    ]);
    nativeToken.value.price = new BigNumber(result[0]?.current_price || 0);
    isPricesLoading.value = false;
  } catch (err) {
    isPricesLoading.value = false;
    nativeBalances.value = {};
    console.error(err);
  }
};
