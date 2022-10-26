<template>
  <div
    class="accounts-item container-inner"
    :class="{ last: isLast }"
    @click="toggle"
  >
    <div class="row justify-content-beetwen align-items-center">
      <div class="col-8">
        <div class="accounts-item__info">
          <img :src="account.image" alt="" />
          <div class="accounts-item__info-block">
            <h3>
              {{ account.name }}<span v-if="account.isLedger">Ledger</span>
            </h3>
            <p>
              {{
                $filters.replaceWithEllipsis(
                  $filters.formatAddress(account.address),
                  6,
                  6
                )
              }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-4 row justify-content-end align-items-center">
        <h3 class="accounts-item__balance">
          {{
            balance === undefined
              ? "--"
              : $filters.cryptoCurrencyFormat(balance.total)
          }}
          <span>{{ token?.symbol || "dot" }}</span>
        </h3>
        <expand class="accounts-item__arrow" :class="{ open: isOpen }" />
      </div>
    </div>
  </div>
  <Transition name="fade">
    <div
      v-show="isOpen"
      class="accounts-item__detail"
      :class="{ last: isLast }"
    >
      <div class="accounts-item__detail-info">
        <div class="row justify-content-beetwen align-items-center">
          <div class="col-3 row justify-content-start">
            <h4>Available</h4>
          </div>
          <div class="col-3 row justify-content-end">
            <p>
              {{
                $filters.currencyFormat(
                  valuesBreakdown.available.usdValue,
                  "USD"
                )
              }}
            </p>
          </div>
          <div class="col-3 row justify-content-end">
            <h3>
              {{
                $filters.cryptoCurrencyFormat(valuesBreakdown.available.balance)
              }}
              <span>{{ token?.symbol || "dot" }}</span>
            </h3>
          </div>
          <div class="col-3 row justify-content-end">
            <base-button title="Stake" :stroke="true" :small="true" />
            <base-button
              title="Send"
              :stroke="true"
              :small="true"
              :action="navigateToSend"
            />
          </div>
        </div>
      </div>
      <div
        v-if="valuesBreakdown.staked.balance"
        class="accounts-item__detail-info"
      >
        <div class="row justify-content-beetwen align-items-center">
          <div class="col-3 row justify-content-start">
            <h4>Staked</h4>
          </div>
          <div class="col-3 row justify-content-end">
            <p>
              {{
                $filters.currencyFormat(valuesBreakdown.staked.usdValue, "USD")
              }}
            </p>
          </div>
          <div class="col-3 row justify-content-end">
            <h3>
              {{
                $filters.cryptoCurrencyFormat(valuesBreakdown.staked.balance)
              }}
              <span>{{ token?.symbol || "dot" }}</span>
            </h3>
          </div>
          <div class="col-3 row justify-content-end"></div>
        </div>
      </div>
      <div
        v-if="valuesBreakdown.bonded.balance"
        class="accounts-item__detail-info"
      >
        <div class="row justify-content-beetwen align-items-center">
          <div class="col-3 row justify-content-start">
            <h4>Bonded</h4>
          </div>
          <div class="col-3 row justify-content-end">
            <p>
              {{
                $filters.currencyFormat(valuesBreakdown.bonded.usdValue, "USD")
              }}
            </p>
          </div>
          <div class="col-3 row justify-content-end">
            <h3>
              {{
                $filters.cryptoCurrencyFormat(valuesBreakdown.bonded.balance)
              }}
              <span>{{ token?.symbol || "dot" }}</span>
            </h3>
          </div>
          <div class="col-3 row justify-content-end">
            <base-button title="Unbond" :stroke="true" :small="true" />
          </div>
        </div>
      </div>
      <div
        v-if="valuesBreakdown.vested.balance"
        class="accounts-item__detail-info"
      >
        <div class="row justify-content-beetwen align-items-center">
          <div class="col-3 row justify-content-start">
            <h4>Vested</h4>
          </div>
          <div class="col-3 row justify-content-end">
            <p>
              {{
                $filters.currencyFormat(valuesBreakdown.vested.usdValue, "USD")
              }}
            </p>
          </div>
          <div class="col-3 row justify-content-end">
            <h3>
              {{
                $filters.cryptoCurrencyFormat(valuesBreakdown.vested.balance)
              }}
              <span>{{ token?.symbol || "dot" }}</span>
            </h3>
          </div>
          <div class="col-3 row justify-content-end">
            <span
              v-if="balance && balance.vestingEndMillisecondsLeft"
              class="accounts-item__detail-info-ends"
            >
              <vue-countdown
                v-slot="{ days, hours, minutes }"
                :interval="60000"
                :time="balance.vestingEndMillisecondsLeft"
              >
                Ends in{{
                  `${days ? ` ${days}d` : ""}${
                    hours ? ` ${hours}h` : ""
                  } ${minutes}m`
                }}
              </vue-countdown>
            </span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import BaseButton from "@/components/base-button/index.vue";
import Expand from "@/icons/common/expand.vue";
import { Account } from "@/types/account";
import { Token } from "@/types/token";
import { Balance } from "@/types/balance";
import VueCountdown from "@chenfengyuan/vue-countdown";
import { useRouter } from "vue-router";

const router = useRouter();

const isOpen = ref<boolean>(false);

const props = defineProps({
  account: {
    type: Object as PropType<Account>,
    default: () => ({}),
  },
  isLast: {
    type: Boolean,
    default: false,
  },
  balance: {
    type: Object as PropType<Balance>,
    default: undefined,
  },
  token: {
    type: Object as PropType<Token>,
    default: undefined,
  },
});

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const valuesBreakdown = computed(() => {
  const numAvailable = props.balance?.available?.toNumber() || 0;
  const numStaked = props.balance?.staked?.toNumber() || 0;
  const numBonded = props.balance?.bonded?.toNumber() || 0;
  const numVested = props.balance?.vested?.toNumber() || 0;

  return {
    available: {
      balance: numAvailable,
      usdValue: numAvailable * (props.token?.price?.toNumber() || 0),
    },
    staked: {
      balance: numStaked,
      usdValue: numStaked * (props.token?.price?.toNumber() || 0),
    },
    bonded: {
      balance: numBonded,
      usdValue: numBonded * (props.token?.price?.toNumber() || 0),
    },
    vested: {
      balance: numVested,
      usdValue: numVested * (props.token?.price?.toNumber() || 0),
    },
  };
});

const navigateToSend = () => {
  router.push({
    name: "send",
    query: {
      from: props.account.address,
    },
  });
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.accounts-item {
  padding: 0 16px !important;
  height: 64px;
  cursor: pointer;
  border-radius: 8px;
  .transition(background, 0.3s);

  &:hover {
    background: @gray004;
  }

  &__info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 64px;

    img {
      width: 32px;
      margin-right: 12px;
    }
    &-block {
      h3 {
        .body1__Regular();
        color: @primaryLabel;
        margin: 0 0 4px 0;

        span {
          padding: 0px 6px;
          height: 18px;
          box-sizing: border-box;
          display: inline-block;
          margin-left: 8px;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 20px;
          font-style: normal;
          font-weight: 700;
          font-size: 10px;
          line-height: 18px;
          color: @secondaryLabel;
          position: relative;
          top: -2px;
        }
      }

      p {
        .caption__Regular();
        color: @secondaryLabel;
        margin: 0;
      }
    }
  }

  &__balance {
    .headline5__Bold();
    color: @primaryLabel;
    margin: 0;

    span {
      text-transform: uppercase;
    }
  }

  &__arrow {
    margin-left: 16px;
    .transition(all, 0.3s);

    &.open {
      .rotate(90deg);
    }
  }

  &__detail {
    padding: 0 0 17px 0;
    border-bottom: 1px solid @gray01;
    margin: 0 16px 0 16px;

    &.last {
      padding: 0;
      border-bottom: 0 none;
    }

    &-info {
      padding: 4px 0 4px 0;
      box-sizing: border-box;

      & > .row {
        min-height: 32px;
      }

      h3 {
        .body1__Meduim();
        color: @primaryLabel;
        margin: 0;

        span {
          text-transform: uppercase;
        }
      }

      h4 {
        .body1__Regular();
        color: @primaryLabel;
        margin: 0;
      }

      p {
        .body1__Regular();
        color: @secondaryLabel;
        margin: 0;
      }

      .base-button {
        margin-right: 16px;

        &:last-child {
          margin-right: 0;
        }
      }

      &-ends {
        .body2__Regular();
        color: @primaryLabel;
      }
    }
  }
}

.fade-enter-active {
  animation: fadeIn 0.3s;
}
.fade-leave-active {
  animation: fadeOut 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
