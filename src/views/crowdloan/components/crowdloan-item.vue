<template>
  <div class="crowdloan-item">
    <div class="crowdloan-item__block">
      <a class="crowdloan-item__info" :href="item.link" target="_blank">
        <img :src="item.image" alt="" />
        <div class="crowdloan-item__info-block">
          <h3>
            {{ item.name }}
          </h3>
          <link-icon class="crowdloan-item__info-block-link" />
        </div>
      </a>
    </div>
    <div class="crowdloan-item__block">
      <div class="crowdloan-item__block-info">
        <p class="crowdloan-item__block-info-amount">
          <b>{{ item.percent.toFixed(2) }} %</b>
          {{ $filters.formatCompactNumber(item.amount) }} of
          {{ $filters.formatCompactNumber(item.cap) }}
        </p>
        <p
          v-if="contribution.contributorsHex.length"
          class="crowdloan-item__block-info-count"
        >
          {{
            $filters.cryptoCurrencyFormat(contribution.contributorsHex.length)
          }}
          contributions
        </p>
      </div>
    </div>
    <div class="crowdloan-item__block">
      <span>{{ item.tokens }}</span>
    </div>
    <div class="crowdloan-item__block">
      <div v-if="item.isContribute" class="crowdloan-item__block-action">
        <p class="crowdloan-item__block-action-timer">
          Ending in<b>
            <vue-countdown
              v-slot="{ days, hours, minutes }"
              :interval="60000"
              :time="item.endMillisecondsLeft"
            >
              {{
                `${days ? ` ${days}d` : ""}${
                  hours ? ` ${hours}h` : ""
                } ${minutes}m`
              }}
            </vue-countdown></b
          >
        </p>
        <div v-if="contribution.amount">
          <base-button
            class="crowdloan-item__block-action-contribute-button"
            :title="isHover ? 'Contribute' : contributedLabel"
            :small="true"
            :action="contributeAction"
            @mouseover="isHover = true"
            @mouseleave="isHover = false"
          />
        </div>
        <base-button
          v-else
          title="Contribute"
          :small="true"
          :action="contributeAction"
        />
      </div>
      <span v-else>
        <div v-if="contribution.hasLoaded">
          <div v-if="contribution.amount">
            <base-button
              class="crowdloan-item__block-action-existing-contribution"
              :title="contributedLabel"
              :small="true"
              :action="contributeAction"
            />
          </div>
          <div v-else>-</div>
        </div>
        <div v-else>Loading contribution...</div>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType, ref, toRef, watch } from "vue";
import { ContributionInfo, CrowdloanInfo } from "@/types/crowdloan";
import BaseButton from "@/components/base-button/index.vue";
import LinkIcon from "@/icons/common/link-icon.vue";
import { useRouter } from "vue-router";
import {
  accounts,
  apiPromise,
  nativeToken,
  selectedCrowdloan,
  selectedNetwork,
} from "@/stores";
import { getContributions } from "@/utils/crowdloan";
import VueCountdown from "@chenfengyuan/vue-countdown";
import { cryptoCurrencyFormat } from "@/utils/filters";

const router = useRouter();

const contribution = ref<ContributionInfo>({
  blockHash: "-",
  contributorsHex: [],
  hasLoaded: false,
  account: "",
  accountHex: "",
  amount: 0,
});

const props = defineProps({
  item: {
    type: Object as PropType<CrowdloanInfo>,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
});

const address = toRef(props, "address");
const isHover = ref(false);

onMounted(() => {
  loadContributionData();
});

watch(
  [selectedNetwork, accounts, address],
  () => {
    loadContributionData();
  },
  { deep: true }
);

const loadContributionData = async () => {
  if (props.address) {
    const api = await apiPromise.value;
    contribution.value.hasLoaded = false;
    contribution.value = await getContributions(
      api,
      props.item.paraId,
      props.address
    );
  }
};

const contributedLabel = computed(() => {
  return `${cryptoCurrencyFormat(
    contribution.value.amount
  )} ${nativeToken.value.symbol.toLocaleUpperCase()}`;
});

const contributeAction = () => {
  selectedCrowdloan.value = props.item;
  router.push({
    name: "crowdloan-contribute",
    query: { address: props.address },
  });
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.crowdloan-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  margin: 8px 0;
  height: 52px;
  .sizing();

  &__block {
    &:nth-child(1) {
      min-width: 25.07%;
    }
    &:nth-child(2) {
      min-width: 31.23%;
    }
    &:nth-child(3) {
      min-width: 17.26%;
    }
    &:nth-child(4) {
      min-width: 26.44%;
      text-align: right;
    }

    span {
      .body2__Regular();
      color: @primaryLabel;
    }

    &-info {
      &-amount {
        .body2__Regular();
        color: @primaryLabel;
        margin: 0 0 3px 0;

        b {
          .body2__Bold();
        }
      }
      &-count {
        .caption__Regular();
        color: @secondaryLabel;
        margin: 0;
      }
    }

    &-action {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;

      &-timer {
        margin-right: 16px;
        .caption__Regular();
        color: @primaryLabel;

        b,
        b > span {
          display: block;
          .caption__Bold();
          color: @accent;
          margin: 3px 0 0 0;
        }
      }

      &-contribute-button {
        background: white;
        color: @accent;
        border: @gray016 solid 1px;
        &:hover {
          color: @white;
        }
      }

      &-existing-contribution {
        background: white;
        color: @accent;
        border: @gray016 solid 1px;
        &:hover {
          background: white;
          color: @accent;
        }
        cursor: default;
      }
    }
  }

  &__info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 52px;
    text-decoration: none;
    cursor: pointer;

    img {
      width: 32px;
      margin-right: 16px;
      border-radius: 100%;
      box-shadow: @shadowIcon;
    }

    &-block {
      position: relative;

      &-link {
        position: absolute;
        right: -20px;
        top: 2.5px;
        opacity: 0;
        .transition(opacity, 0.3s);
      }

      h3 {
        .body2__Medium();
        color: @primaryLabel;
        margin: 0 0 1px 0;

        span {
          padding: 0px 6px;
          height: 18px;
          box-sizing: border-box;
          display: inline-block;
          margin-left: 8px;
          background: @error01;
          border-radius: 20px;
          font-style: normal;
          font-weight: 700;
          font-size: 10px;
          line-height: 18px;
          color: @error;
          position: relative;
          top: -2px;
        }
      }

      p {
        .caption__Regular();
        color: @secondaryLabel;
        margin: 0;

        &.over {
          .caption__Bold();
          color: @orange;

          .info-tooltip {
            top: 3px;
            left: 2px;
          }
        }
      }
    }

    &:hover {
      .crowdloan-item__info-block-link {
        opacity: 1;
      }
    }
  }
}
</style>
