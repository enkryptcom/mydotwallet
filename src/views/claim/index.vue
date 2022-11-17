<template>
  <white-wrapper class="claim__wrap">
    <h2 class="claim__title">
      Claim {{ tokenSymbol }} tokens for Ethereum presale address
    </h2>
    <p class="claim__text">
      This claims process only applies to {{ tokenSymbol }} (old) that were
      purchased in the form of {{ tokenSymbol }} Allocation Indicators on
      Ethereum before June 30, 2020.
    </p>
    <p class="claim__text claim__text--gray">
      If you bought your {{ tokenSymbol }} tokens more recently or from another
      source, this process does not apply to you. You do not need to claim.
    </p>
    <h4 class="claim__label">Check your Ethereum address</h4>
    <claim-address-input
      :account="account"
      :value="address"
      @update:address="addressInput"
    />
    <claim-valid-account
      v-if="!isLoading && isValid"
      :token="nativeToken"
      :amount="claimable.toNumber()"
    />
    <claim-invalid-account v-if="account && !isLoading && !isValid" />
    <buttons-block>
      <base-button
        v-if="isConnected"
        :disabled="isLoading || !isValid"
        title="Continue"
        :action="nextAction"
        :send="true"
      />
      <base-button
        v-else
        title="Connect wallet to claim"
        :action="connectWallet"
      />
    </buttons-block>
  </white-wrapper>

  <white-wrapper class="claim__wrap claim__wrap--second">
    <claim-enkrypt-banner />
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ClaimAddressInput from "./components/claim-address-input.vue";
import ClaimEnkryptBanner from "./components/claim-enkrypt-banner.vue";
import ClaimValidAccount from "./components/claim-valid-account.vue";
import ClaimInvalidAccount from "./components/claim-invalid-account.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import { Account } from "@/types/account";
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import {
  apiPromise,
  nativeToken,
  shouldOpenWalletSelector,
  walletSelected,
} from "@/stores";
import { isAddress } from "web3-utils";
import createIcon from "@/libs/identicon/ethereum";
import { BN_ZERO } from "@polkadot/util";
import type { Option } from "@polkadot/types";
import type { BalanceOf } from "@polkadot/types/interfaces";
import BigNumber from "bignumber.js";
import { fromBase } from "@/utils/units";

const router = useRouter();

const account = ref<Account>();
const address = ref<string>("");
const isValid = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const claimable = ref<BigNumber>(new BigNumber(0));

watch(account, async () => {
  if (account.value) {
    try {
      isLoading.value = true;
      const api = await apiPromise.value;

      const claims = await api.query.claims.claims<Option<BalanceOf>>(
        account.value.address
      );
      claimable.value = new BigNumber(
        fromBase(
          claims.unwrapOr(BN_ZERO).toString(),
          nativeToken.value.decimals
        )
      );
      isValid.value = claimable.value.gt(0);

      isLoading.value = false;
    } catch (err) {
      console.error(
        "Unexpected error when querying if account has claimable balance",
        err
      );
      isLoading.value = false;
    }
  }
});

const addressInput = (newVal: string) => {
  const trimmed = newVal.trim();
  address.value = trimmed;
  const isValidAddress = isAddress(trimmed);
  account.value = isValidAddress
    ? {
        id: Number.MAX_SAFE_INTEGER,
        name: "",
        image: createIcon(trimmed),
        address: trimmed,
        isLedger: false,
      }
    : undefined;
};

const nextAction = () => {
  router.push({
    name: "claiming",
    query: {
      ethAddress: account.value?.address,
    },
  });
};

const connectWallet = () => {
  shouldOpenWalletSelector.value = true;
};

const isConnected = computed(() => walletSelected.value.id !== 1);
const tokenSymbol = computed(() =>
  nativeToken.value.symbol.toLocaleUpperCase()
);
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.claim {
  &__wrap {
    margin-top: 32px !important;
    padding: 16px 32px;

    &--second {
      margin-top: 16px;
      overflow: hidden;
    }
  }
  &__title {
    .headline4__Bold();
    color: @primaryLabel;
    margin: 8px 0 16px 0;
  }
  &__text {
    .body1__Regular();
    color: @primaryLabel;
    margin: 0 0 16px 0;

    &--gray {
      color: @secondaryLabel;
    }
  }
  &__label {
    .headline5__Bold();
    color: @primaryLabel;
    margin: 8px 0 16px 0;
  }
}
</style>
