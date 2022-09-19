import { ref, computed } from "vue";
import { Network } from "@/types/network";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { InjectedExtension } from "@polkadot/extension-inject/types";
import type { Signer } from "@polkadot/api/types";
import { Account } from "@/types/account";

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

export const accounts = ref<Account[]>([]);

export const extension = ref<InjectedExtension | undefined>(undefined);

export const signer = ref<Signer | undefined>(undefined);
