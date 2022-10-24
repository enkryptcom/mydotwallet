import { ref, computed } from "vue";
import { Network } from "@/types/network";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import type { Signer } from "@polkadot/api/types";
import { Account } from "@/types/account";
import { dot, ksm } from "@/types/tokens";
import { Balance } from "@/types/balance";
import { WalletItem } from "@/types/wallet-list";
import { walletConnect } from "@/types/wallets";

const POLKADOT_ENDPOINTS = [
  "wss://rpc.polkadot.io",
  "wss://polkadot.api.onfinality.io/public-ws",
  "wss://polkadot-rpc.dwellir.com",
  "wss://public-rpc.pinknode.io/polkadot",
  "wss://polkadot.public.curie.radiumblock.io/ws",
];
const KUSAMA_ENDPOINTS = ["wss://kusama-rpc.polkadot.io"];

export const selectedNetwork = ref(Network.Polkadot);

export const apiPromise = computed(() => {
  const endpoints =
    selectedNetwork.value === Network.Polkadot
      ? POLKADOT_ENDPOINTS
      : KUSAMA_ENDPOINTS;

  const provider = new WsProvider(endpoints);

  return ApiPromise.create({ provider }).then((api) => api);
});

export const walletSelected = ref<WalletItem>(walletConnect);

export const shouldOpenWalletSelector = ref<boolean>(false);

export const accounts = ref<Account[]>([]);

export const nativeBalances = ref<Record<string, Balance>>({});

export const ss58Format = computed(() => {
  switch (selectedNetwork.value) {
    case Network.Polkadot:
      return 0;
    case Network.Kusama:
      return 2;
    default:
      return 0;
  }
});

export const nativeToken = computed(() => {
  switch (selectedNetwork.value) {
    case Network.Polkadot:
      return dot;
    case Network.Kusama:
      return ksm;
    default:
      return dot;
  }
});

export const isBalancesLoading = ref<boolean>(false);

export const isPricesLoading = ref<boolean>(false);

export const extension = ref<InjectedExtension>();

export const signer = ref<Signer>();
