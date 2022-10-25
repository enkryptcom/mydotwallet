<template>
  <select-list
    ref="selectRef"
    :select="walletSelected"
    :items="availableExtensions"
    :is-list-image="true"
    @update:select="selectItem"
  />
</template>

<script setup lang="ts">
import {
  walletConnect,
  walletConnectItems,
  walletDisconnect,
  walletGetEnkrypt,
} from "@/types/wallets";
import SelectList from "@/components/select-list/index.vue";
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
import createIcon from "@/libs/identicon/polkadot";
import { formatAddress } from "@/utils/filters";
import { ComponentPublicInstance, onMounted, ref, watch } from "vue";
import LastExtensionState from "@/state/extension";
import { WalletItem } from "@/types/wallet-list";

const lastExtensionState = new LastExtensionState();

const selectRef = ref<ComponentPublicInstance<any>>();
const availableExtensions = ref<WalletItem[]>([]);

onMounted(async () => {
  const lastExtension = await lastExtensionState.getLastExtensionName();
  getAvailableWallets();

  if (lastExtension) {
    try {
      await connectToWallet(lastExtension);
      const walletItem = walletConnectItems.find(
        (wallet) => wallet.extensionName === lastExtension
      );

      if (walletItem) {
        walletSelected.value = walletItem;
      }
    } catch {
      console.error("Could not connect to previous wallet");
    }
  }
});

watch(shouldOpenWalletSelector, () => {
  if (shouldOpenWalletSelector && selectRef) {
    selectRef.value.isOpen = true;
    shouldOpenWalletSelector.value = false;
  }
});

const getAvailableWallets = () => {
  const injectedWindow = window as Window & InjectedWindow;
  const injectedExtensions = injectedWindow?.injectedWeb3;

  let extensions = [];

  if (injectedExtensions) {
    for (const extension of Object.keys(injectedExtensions)) {
      const e = walletConnectItems.find(
        (wallet) => wallet.extensionName === extension
      );

      if (e) {
        extensions.push(e);
      }
    }

    availableExtensions.value = [...extensions, walletDisconnect];
  } else {
    availableExtensions.value = [walletGetEnkrypt];
  }
};

const selectItem = async (item: WalletItem) => {
  // If disconnecting
  if (item.id === 1) {
    walletSelected.value = walletConnect;
    signer.value = undefined;
    extension.value = undefined;
    accounts.value = [];
  } else if (item.id === 2) {
    window.open("https://www.enkrypt.com", "_blank");
  } else {
    // If connecting
    try {
      const accounts = await connectToWallet(item.extensionName);
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

const connectToWallet = async (wallet: string | undefined) => {
  if (!wallet) {
    return;
  }

  wallet = wallet.toLowerCase();

  const injectedWindow = window as Window & InjectedWindow;
  const injectedExtension = injectedWindow?.injectedWeb3?.[wallet];
  const rawExtension = await injectedExtension.enable("mydotwallet");
  const foundExtension: InjectedExtension = {
    ...rawExtension,
    name: wallet,
    version: injectedExtension.version,
  };
  const foundAccounts = await foundExtension.accounts.get();

  signer.value = foundExtension.signer;
  extension.value = foundExtension;
  await lastExtensionState.setLastExtension(foundExtension.name);

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
