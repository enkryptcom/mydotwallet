<template>
  <select-list
    ref="selectRef"
    :select="walletSelected"
    :items="walletConnectItems"
    :is-list-image="true"
    @update:select="selectItem"
  />
</template>

<script setup lang="ts">
import { walletConnect, walletConnectItems } from "@/types/wallets";
import SelectList from "@/components/select-list/index.vue";
import { SelectItem } from "@/types/select-list";
import {
  accounts,
  extension,
  shouldOpenWalletSelector,
  signer,
  walletSelected,
} from "@/stores";
import {
  InjectedExtension,
  InjectedWindow,
} from "@polkadot/extension-inject/types";
import { WalletItem } from "@/types/wallet-list";
<<<<<<< HEAD
import createIcon from "@/libs/identicon/polkadot";
=======
import createIcon from "@/libs/polkadot-identicon";
>>>>>>> develop
import { formatAddress } from "@/utils/filters";
import { ComponentPublicInstance, ref, watch } from "vue";

const selectRef = ref<ComponentPublicInstance<any>>();

watch(shouldOpenWalletSelector, () => {
  if (shouldOpenWalletSelector && selectRef) {
    selectRef.value.isOpen = true;
    shouldOpenWalletSelector.value = false;
  }
});

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

  return accounts.value;
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";
</style>
