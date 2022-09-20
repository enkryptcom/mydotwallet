<template>
  <white-wrapper v-if="!isSend" class="claiming__wrap">
    <div class="claiming__header">
      <back-button :action="back" />
    </div>
    <h2 class="claiming__title">Claiming</h2>
    <claiming-amount :token="token" :amount="amount" />
    <h3 class="claiming__sub-title">Select your Polkadot account</h3>
    <select-account-input
      :account="myAccount"
      :accounts="accounts"
      :is-amount="true"
      title="Claim to account"
      @update:select="selectMyAccount"
    />
    <h3 class="claiming__sub-title">Sign message with your Ethereum address</h3>
    <claim-address-input
      :account="account"
      :value="address"
      @update:address="addressInput"
    />
    <h4 class="claiming__third-title">
      1. Copy the following string and sign it with the Ethereum account you
      used during the pre-sale:
    </h4>
    <div class="claiming__textarea">
      Pay DOTs to the Polkadot account:<br />e08ea504bf28771d0c3c78dac78c0876246eea19fc3017debe2142999b617056
      <a class="claiming__copy" @click="copy"><copy-icon /></a>
    </div>
    <h4 class="claiming__third-title">
      2. Paste the signed message into the field below:
    </h4>
    <textarea
      class="claiming__textarea claiming__textarea--paste"
      placeholder="Paste here"
    ></textarea>
    <claiming-error />
    <buttons-block>
      <base-button :title="buttonTitle" :action="nextAction" :send="true" />
    </buttons-block>
  </white-wrapper>
  <white-wrapper v-else>
    <claiming-success :token="token" :amount="amount" />
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import BackButton from "@/components/back-button/index.vue";
import SelectAccountInput from "@/components/select-account-input/index.vue";
import CopyIcon from "@/icons/common/copy-icon.vue";
import ClaimAddressInput from "../claim/components/claim-address-input.vue";
import ClaimingAmount from "./components/claiming-amount.vue";
import ClaimingError from "./components/claiming-error.vue";
import ClaimingSuccess from "./components/claiming-success.vue";
import { Account } from "@/types/account";
import { Token } from "@/types/token";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { accounts, recent } from "@/types/mock";
import { dot } from "@/types/tokens";

const router = useRouter();

const myAccount = ref<Account>(accounts[0]);
const amount = ref<number>(84.556);
const token = ref<Token>(dot);
const isSend = ref<boolean>(false);

const account = ref<Account | null>(null);
const address = ref<string>("");

const nextAction = () => {
  isSend.value = true;
};

const back = () => {
  router.go(-1);
};

const selectMyAccount = (account: Account) => {
  myAccount.value = account;
};

const addressInput = (newVal: string) => {
  address.value = newVal;
  account.value = address.value.length > 41 ? recent[0] : null;
};

const copy = () => {
  navigator.clipboard.writeText(
    "e08ea504bf28771d0c3c78dac78c0876246eea19fc3017debe2142999b617056"
  );
};

const buttonTitle = computed(() => {
  let title = "Claim ";
  title += amount.value;
  title += " " + token.value.symbol.toLocaleUpperCase();

  return title;
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.claiming {
  &__wrap {
    padding: 16px 32px;
  }
  &__header {
    position: relative;
    height: 32px;
    margin-bottom: 16px;
  }
  &__title {
    .headline4__Bold();
    color: @primaryLabel;
    margin: 0 0 8px 0;
  }
  &__sub-title {
    .headline5__Bold();
    color: @primaryLabel;
    margin: 0 0 16px 0;
  }
  &__third-title {
    .body1__Regular();
    color: @primaryLabel;
    margin: 16px 0 8px 0;
    padding-right: 21%;
  }
  &__textarea {
    padding: 16px;
    border: 1px solid @gray01;
    border-radius: 16px;
    background-color: @white;
    width: 100%;
    resize: none;
    .mono__text();
    color: @secondaryLabel;
    height: auto;
    position: relative;
    outline: none;

    &--paste {
      height: 92px;
      .sizing();
    }
  }
  &__copy {
    opacity: 1;
    .transition(opacity, 0.3s);
    position: absolute;
    right: 16px;
    top: 50%;
    margin-top: -12px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }
  }
}
</style>
