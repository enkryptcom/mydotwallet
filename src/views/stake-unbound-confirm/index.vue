<template>
  <white-wrapper class="stake-unbound-confirm__wrap">
    <div class="stake-unbound-confirm__header">
      <back-button :action="back" />
      <h1 class="stake-unbound-confirm__title">
        Stop staking and unbond funds
      </h1>
    </div>
    <p class="stake-unbound-confirm__description">
      Double check the information and confirm transaction.
    </p>

    <div class="stake-unbound-confirm__block">
      <div class="stake-unbound-confirm__block-item">
        <stake-confirm-account :account="fromAccount" title="From" />
      </div>
      <div class="stake-unbound-confirm__block-item">
        <stake-confirm-amount :token="token" :amount="amount" />
      </div>
      <div class="stake-unbound-confirm__block-item">
        <stake-confirm-fee />
      </div>
    </div>

    <buttons-block>
      <base-button
        title="Stop staking and unbond"
        :action="nextAction"
        :send="true"
      />
    </buttons-block>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import BackButton from "@/components/back-button/index.vue";
import StakeConfirmAmount from "../stake-confirm/components/stake-confirm-amount.vue";
import StakeConfirmAccount from "../stake-confirm/components/stake-confirm-account.vue";
import StakeConfirmFee from "../stake-confirm/components/stake-confirm-fee.vue";
import { Account } from "@/types/account";
import { Token } from "@/types/token";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { dot, accounts } from "@/types/mock";

const router = useRouter();
const fromAccount = ref<Account>(accounts[0]);
const amount = ref<number>(1000);
const token = ref<Token>(dot);

const nextAction = () => {
  router.go(-2);
};

const back = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-unbound-confirm {
  &__wrap {
    padding: 16px 32px;
  }
  &__header {
    position: relative;
  }
  &__title {
    .headline5__Bold();
    color: @primaryLabel;
    margin: 0 0 16px 0;
    padding-left: 60px;
    .sizing();
  }
  &__description {
    .body1__Regular();
    color: @secondaryLabel;
    margin: 0 0 16px 0;
    padding: 0 60px;
    .sizing();
  }
  &__block {
    background: @gray002;
    border-radius: 16px;
    .sizing();

    &-item {
      position: relative;

      &::after {
        content: "";
        width: calc(~"100% - 60px");
        height: 1px;
        background-color: @gray01;
        position: absolute;
        right: 0;
        bottom: 0;
      }

      &:last-child {
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
