<template>
  <select-list
    :select="walletSelected"
    :items="walletConnectItems"
    :is-list-image="true"
    @update:select="selectItem"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { walletConnect, walletConnectItems } from "@/types/wallets";
import SelectList from "@/components/select-list/index.vue";
import { SelectItem } from "@/types/select-list";
import { accounts, extension, signer } from "@/stores";
import {
  InjectedExtension,
  InjectedWindow,
} from "@polkadot/extension-inject/types";
import { WalletItem } from "@/types/wallet-list";
import createIcon from "@/libs/polkadot-identicon";
import { formatAddress } from "@/utils/filters";

const walletSelected = ref<SelectItem>(walletConnect);

const selectItem = async (item: SelectItem) => {
  // If disconnecting
  if (item.id === 1) {
    walletSelected.value = walletConnect;
    signer.value = undefined;
    extension.value = undefined;
    accounts.value = [];
  } else {
    // If connecting
    try {
      const accounts = await connectToWallet(item);
      if (accounts) {
        walletSelected.value = item;
      } else {
        console.error("No accounts found");
      }
    } catch (err) {
      console.error("Couldn't connect to wallet", err);
    }
  }
};

const connectToWallet = async (wallet: WalletItem) => {
  if (!wallet.extensionName) {
    return;
  }

  const injectedWindow = window as Window & InjectedWindow;
  const injectedExtension =
    injectedWindow?.injectedWeb3?.[wallet.extensionName];
  const rawExtension = await injectedExtension.enable("mydotwallet");
  const foundExtension: InjectedExtension = {
    ...rawExtension,
    name: wallet.extensionName,
    version: injectedExtension.version,
  };
  const foundAccounts = await foundExtension.accounts.get();

  signer.value = foundExtension.signer;
  extension.value = foundExtension;

  accounts.value = foundAccounts
    .filter((item) => item.type !== "ethereum")
    .map((item, index) => ({
      id: index,
      name: item.name || `Account ${index + 1}`,
      address: formatAddress(item.address),
      image: createIcon(item.address),
      isLedger: false,
    }));

  return accounts;
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";
</style>
