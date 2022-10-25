<template>
  <white-wrapper class="claim__wrap">
    <h2 class="claim__title">Claim DOT tokens for Ethereum presale address</h2>
    <p class="claim__text">
      This claims process only applies to DOT (old) that were purchased in the
      form of DOT Allocation Indicators on Ethereum before June 30, 2020.
    </p>
    <p class="claim__text claim__text--gray">
      If you bought your DOT tokens more recently or from another source, this
      process does not apply to you. You do not need to claim.
    </p>
    <h4 class="claim__label">Check your Ethereum address</h4>
    <claim-address-input
      :account="account"
      :value="address"
      @update:address="addressInput"
    />
    <claim-valid-account v-if="isValid" :token="token" :amount="80.4" />
    <claim-unvalid-account v-if="isValid" />
    <buttons-block>
      <base-button title="Continue" :action="nextAction" :send="true" />
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
import ClaimUnvalidAccount from "./components/claim-unvalid-account.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import { Account } from "@/types/account";
import { Token } from "@/types/token";
import { recent } from "@/types/mock";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { dot } from "@/types/tokens";

const router = useRouter();

const account = ref<Account | null>(null);
const address = ref<string>("");
const isValid = ref<boolean>(false);
const token = ref<Token>(dot);

const addressInput = (newVal: string) => {
  address.value = newVal;
  account.value = address.value.length > 41 ? recent[0] : null;
  isValid.value = address.value.length > 41;
};

const nextAction = () => {
  router.push({ name: "claiming" });
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.claim {
  &__wrap {
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
