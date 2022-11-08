<template>
  <white-wrapper class="crowdloan-contribute__wrap">
    <div class="crowdloan-contribute__header">
      <back-button :action="back" />
      <h1 class="crowdloan-contribute__title">Contribute to fund</h1>
    </div>
    <p class="crowdloan-contribute__description">
      Contribute to a crowd sale. It will be withdrawable when the crowdloan has
      ended and the funds are unused.
    </p>

    <select-account-input
      :account="fromAccount"
      :accounts="accounts"
      :amount="availableBalance"
      :is-amount="true"
      title="From"
      @update:select="selectAccount"
    />

    <div class="crowdloan-contribute__info">
      <div class="crowdloan-contribute__info-item">
        <p>Minimum allowed</p>
        <h5>
          {{ $filters.cryptoCurrencyFormat(minContribution)
          }}<span>{{ nativeToken.symbol.toLocaleUpperCase() }}</span>
        </h5>
      </div>
      <div class="crowdloan-contribute__info-item">
        <p>Remaining till cap</p>
        <h5>
          {{
            $filters.formatCompactNumber(
              (crowdloan?.cap || 0) - (crowdloan?.amount || 0)
            )
          }}
          <span>{{ nativeToken.symbol.toLocaleUpperCase() }}</span>
        </h5>
      </div>
    </div>

    <amount-input
      :has-enough-balance="hasEnough"
      :is-error="!!minValueErrorMessage"
      :token="nativeToken"
      :value="String(amount)"
      :max-value="nativeBalances[fromAccount?.address]?.available"
      :inner-error-message="minValueErrorMessage"
      @update:amount="inputAmount"
    />

    <fee-info :fee="fee" />

    <buttons-block>
      <base-button
        title="Continue"
        :action="nextAction"
        :send="true"
        :disabled="!isValid"
      />
    </buttons-block>
  </white-wrapper>
</template>

<script setup lang="ts">
import WhiteWrapper from "@/components/white-wrapper/index.vue";
import ButtonsBlock from "@/components/buttons-block/index.vue";
import BaseButton from "@/components/base-button/index.vue";
import BackButton from "@/components/back-button/index.vue";
import AmountInput from "@/components/amount-input/index.vue";
import FeeInfo from "@/components/fee-info/index.vue";
import SelectAccountInput from "@/components/select-account-input/index.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Account } from "@/types/account";
import { CrowdloanInfo } from "@/types/crowdloan";
import {
  accounts,
  apiPromise,
  nativeBalances,
  nativeToken,
  selectedCrowdloan,
  selectedNetwork,
} from "@/stores";
import { GasFeeInfo } from "@/types/transaction";
import { useGetNativeBalances } from "@/libs/balances";
import { useGetNativePrice } from "@/libs/prices";
import { async } from "rxjs";
import { getSingleCrowdloanItem } from "@/utils/crowdloan";
import { fromBase, isValidDecimals, toBase } from "@/utils/units";
import { toBN } from "web3-utils";
import { getGasFeeInfo } from "@/utils/fee";
import { ParaId } from "@polkadot/types/interfaces";
import { crowdloanContributeExtrinsic } from "@/utils/extrinsic";

const router = useRouter();

const fromAccount = ref<Account>(accounts.value[0]);
const amount = ref<number>(0);
const fee = ref<GasFeeInfo>();
const crowdloan = ref<CrowdloanInfo>();
const minContribution = ref(0);
const hasEnough = ref(true);

onMounted(() => {
  if (!selectedCrowdloan.value) {
    router.replace({ name: "crowdloan" });
  }

  crowdloan.value = selectedCrowdloan.value;
  useGetNativeBalances();
  useGetNativePrice();
  updateMinContribution();
  refreshSingleCrowdloan();
});

const refreshSingleCrowdloan = async () => {
  if (!selectedCrowdloan.value?.paraId) {
    return;
  }
  const api = await apiPromise.value;
  const result = await getSingleCrowdloanItem(
    api,
    selectedCrowdloan.value.paraId
  );
  crowdloan.value = result;
};

watch([accounts], () => {
  useGetNativeBalances();
  useGetNativePrice();
  fromAccount.value = accounts.value[0];
});

watch([selectedNetwork], () => {
  useGetNativeBalances();
  useGetNativePrice();
  refreshSingleCrowdloan();
  updateMinContribution();
});

watch(
  [amount, nativeBalances, fromAccount],
  async () => {
    if (!amount.value || !fromAccount.value?.address) {
      return;
    }

    if (!isValidDecimals(amount.value.toString(), nativeToken.value.decimals)) {
      hasEnough.value = false;
      return;
    }

    const api = await apiPromise.value;

    const rawAmount = toBN(
      toBase(amount.value?.toString() || "0", nativeToken.value.decimals)
    );

    const rawBalance = toBN(
      toBase(
        nativeBalances[fromAccount.value.address]?.available.toString() || "0",
        nativeToken.value.decimals
      )
    );

    if (rawAmount.gt(rawBalance)) {
      hasEnough.value = false;
    } else {
      hasEnough.value = true;
    }

    const tx = await crowdloanContributeExtrinsic(
      api,
      api.createType<ParaId>("ParaId", crowdloan.value?.paraId),
      rawAmount.toString()
    );

    fee.value = await getGasFeeInfo(tx, fromAccount.value.address);
  },
  { deep: true }
);

const minValueErrorMessage = computed(() => {
  if (minContribution.value > amount.value) {
    return `Minimum amount is ${
      minContribution.value
    } ${nativeToken.value.symbol.toLocaleUpperCase()}`;
  }
  return "";
});

const updateMinContribution = async () => {
  const api = await apiPromise.value;
  minContribution.value = Number(
    fromBase(
      api.consts.crowdloan?.minContribution?.toString() || "0",
      nativeToken.value.decimals
    )
  );
};

const isValid = computed<boolean>(() => {
  return (
    !!fromAccount.value &&
    Number(amount.value) > 0 &&
    hasEnough.value &&
    !minValueErrorMessage.value
  );
});

const availableBalance = computed(() => {
  if (!nativeBalances || !fromAccount.value) {
    return 0;
  }

  return nativeBalances[fromAccount.value.address]?.available.toNumber() || 0;
});

const nextAction = () => {
  selectedCrowdloan.value = crowdloan.value;
  router.push({ name: "crowdloan-confirm" });
};

const back = () => {
  router.go(-1);
};

const inputAmount = (newVal: string) => {
  amount.value = Number(newVal);
};

const selectAccount = (account: Account) => {
  fromAccount.value = account;
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.crowdloan-contribute {
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
  &__info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    padding: 0 60px;
    margin: 0 0 16px 0;
    .sizing();

    &-item {
      margin-right: 24px;
      p {
        .caption__Regular();
        color: @secondaryLabel;
        margin: 0 0 4px 0;
      }
      h5 {
        .body1__Regular();
        color: @primaryLabel;
        margin: 0;

        span {
          text-transform: uppercase;
        }
      }
    }
  }
  &__fee {
    padding: 0 60px;
    .sizing();
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;

    &-title {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.25px;
      color: @secondaryLabel;
      margin: 0 10px 0 0;
    }

    &-fiat {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.25px;
      color: @secondaryLabel;
      margin: 0 10px 0 0;
    }

    &-amount {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.25px;
      color: @tertiaryLabel;
      margin: 0;

      span {
        text-transform: uppercase;
      }
    }
  }
}
</style>
