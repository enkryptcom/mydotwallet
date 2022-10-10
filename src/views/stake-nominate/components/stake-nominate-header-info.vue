<template>
  <div class="stake-nominate__header-info">
    <div class="stake-nominate__header-info-block">
      <p>Staking amount</p>
      <h5>
        <img src="@/assets/pic/polkadot-white.png" />
        <span>{{ $filters.cryptoCurrencyFormat(amount) }} DOT</span>
      </h5>
    </div>
    <div class="stake-nominate__header-info-block">
      <p>Estimated Returns</p>
      <h5>{{ $filters.cryptoCurrencyFormat(returns) }} DOT</h5>
    </div>
    <div class="stake-nominate__header-info-block">
      <p>Estimated Yield</p>
      <h5>{{ $filters.cryptoCurrencyFormat(yield) }}%</h5>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  amount: {
    type: Number,
    default: 0,
  },
  returns: {
    type: Number,
    default: 0,
  },
  yield: {
    type: Number,
    default: 0,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.stake-nominate {
  &__header {
    &-info {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      &-block {
        margin: 0 0 0 24px;
        p {
          .caption__Regular();
          letter-spacing: 0.25px;
          color: @secondaryLabel;
          margin: 0 0 1px 0;
        }
        h5 {
          .body1__Meduim();
          color: @primaryLabel;
          margin: 0;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;

          img {
            width: 20px;
            height: 20px;
            box-shadow: @shadowIcon;
            border-radius: 100%;
            margin-right: 4px;
          }
        }
      }
    }
  }
}
</style>
