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
import { store } from "@/store";
import {
  InjectedExtension,
  InjectedWindow,
} from "@polkadot/extension-inject/types";
import { WalletItem } from "@/types/wallet-list";
import createIcon from "@/libs/polkadot-identicon";

const walletSelected = ref<SelectItem>(walletConnect);

const selectItem = async (item: SelectItem) => {
  // If disconnecting
  if (item.id === 1) {
    walletSelected.value = walletConnect;
    store.signer = undefined;
    store.extension = undefined;
    store.accounts = [];
  } else {
    // If connecting
    const accounts = await connectToWallet(item);
    console.log("Accounts found: ", accounts, store);
    if (accounts) {
      walletSelected.value = item;
    }
  }
};

const connectToWallet = async (wallet: WalletItem) => {
  if (!wallet.extensionName) {
    return;
  }

  try {
    const injectedWindow = window as Window & InjectedWindow;
    const injectedExtension =
      injectedWindow?.injectedWeb3?.[wallet.extensionName];
    const rawExtension = await injectedExtension.enable("mydotwallet");
    const extension: InjectedExtension = {
      ...rawExtension,
      name: wallet.extensionName,
      version: injectedExtension.version,
    };
    const accounts = await extension.accounts.get();

    store.signer = extension.signer;
    store.extension = extension;
    store.accounts = accounts.map((item, index) => ({
      id: index,
      name: item.name || `Account ${index + 1}`,
      address: item.address,
      image: createIcon(item.address),
      balance: Math.random() * 100,
      isLedger: false,
    }));

    return accounts;
  } catch (e) {
    console.error(e);
    return;
  }
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";
</style>
