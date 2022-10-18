import { ref, computed } from "vue";
import { Network } from "@/types/network";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import type { Signer } from "@polkadot/api/types";
import { Account } from "@/types/account";
import { dot, ksm, wnd } from "@/types/tokens";
import { Balance } from "@/types/balance";
import { WalletItem } from "@/types/wallet-list";
import { walletConnect } from "@/types/wallets";
import { StakingOptions } from "@/types/staking";

const POLKADOT_ENDPOINTS = [
  "wss://rpc.polkadot.io",
  "wss://polkadot.api.onfinality.io/public-ws",
  "wss://polkadot-rpc.dwellir.com",
  "wss://public-rpc.pinknode.io/polkadot",
  "wss://polkadot.public.curie.radiumblock.io/ws",
];
const KUSAMA_ENDPOINTS = ["wss://kusama-rpc.polkadot.io"];
const WESTEND_ENDPOINTS = [
  "wss://westend-rpc.polkadot.io",
  "wss://westend.api.onfinality.io/public-ws",
  "wss://rpc.pinknode.io/westend/explorer",
];

export const selectedNetwork = ref(Network.Westend);

export const apiPromise = computed(async () => {
  let endpoints;

  switch (selectedNetwork.value) {
    case Network.Polkadot:
      endpoints = WESTEND_ENDPOINTS;
    case Network.Kusama:
      endpoints = KUSAMA_ENDPOINTS;
    case Network.Westend:
      endpoints = WESTEND_ENDPOINTS;
    default:
      endpoints = WESTEND_ENDPOINTS;
  }

  const provider = new WsProvider(endpoints);

  const api = await ApiPromise.create({ provider });
  return api;
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
    case Network.Westend:
      return 42;
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
    case Network.Westend:
      return wnd;
    default:
      return dot;
  }
});

export const isBalancesLoading = ref<boolean>(false);

export const isPricesLoading = ref<boolean>(false);

export const extension = ref<InjectedExtension>();

export const signer = ref<Signer>();

export const stakingWizardOptions = ref<StakingOptions>({
  isCompounding: true,
  period: 0,
});
