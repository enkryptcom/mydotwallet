<template>
  <div class="account-select-item">
    <div class="account-select-item__info">
      <img :src="account.image" alt="" />
      <div class="account-select-item__info-block">
        <h3 v-if="account.name">
          {{ account.name }}
          <span>{{ $filters.replaceWithEllipsis(account.address, 6, 6) }}</span>
        </h3>
        <h3 v-else>{{ account.address }}</h3>
        <p v-if="account.isLedger">Ledger</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Account } from "@/types/account";
import { PropType } from "vue";

defineProps({
  account: {
    type: Object as PropType<Account>,
    default: null,
  },
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.account-select-item {
  background: @white;
  padding: 0 8px;
  margin: 0 8px;
  .sizing();
  border-radius: 8px;
  .transition(background, 0.3s);
  cursor: pointer;
  height: 56px;
  position: relative;

  &:hover {
    background: @gray004;
  }

  &__info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    height: 56px;

    img {
      width: 32px;
      margin-right: 15px;
    }
    &-block {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      h3 {
        .body1__Regular();
        color: @primaryLabel;
        margin: 0;

        span {
          .caption__Regular();
          color: @tertiaryLabel;
          margin: 0 0 0 8px;
          display: inline-block;
        }
      }

      p {
        padding: 0px 6px;
        height: 18px;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.04);
        border-radius: 20px;
        font-style: normal;
        font-weight: 700;
        font-size: 10px;
        line-height: 18px;
        color: @secondaryLabel;
        position: relative;
        margin: 0;
        position: absolute;
        right: 16px;
        top: 50%;
        margin-top: -9px;
      }
    }
  }
}
</style>
