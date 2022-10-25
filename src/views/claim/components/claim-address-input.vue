<template>
  <div class="claim-address-input">
    <div class="claim-address-input__info">
      <img v-if="account" :src="account.image" />
      <div v-else class="claim-address-input__info-icon"></div>
      <div class="claim-address-input__info-name">
        <h5 class="claim-address-input__title">Ethereum presale address</h5>
        <input
          ref="inputRef"
          v-model="textValue"
          type="text"
          class="claim-address-input__input"
          placeholder="0x… address"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Account } from "@/types/account";
import { PropType, ref, computed, ComponentPublicInstance } from "vue";

const inputRef = ref<ComponentPublicInstance<HTMLInputElement>>();
defineExpose({ inputRef });

const emit = defineEmits(["update:address"]);

const props = defineProps({
  account: {
    type: Object as PropType<Account | null>,
    default: null,
  },
  value: {
    type: String,
    default: () => {
      return "";
    },
  },
});

const textValue = computed({
  get: () => props.value,
  set: (value) => emit("update:address", value),
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.claim-address-input {
  width: 100%;
  height: 64px;
  display: block;
  text-decoration: none;
  position: relative;
  box-sizing: border-box;
  padding: 0 16px;
  border: 1px solid @gray01;
  border-radius: 16px;

  &__title {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.5px;
    color: @secondaryLabel;
    margin: 0 0 2px 0;
  }

  &__input {
    width: 100%;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: @primaryLabel;
    border: 0 none;
    outline: none;
    padding: 0;

    &.sized {
      width: auto;
    }

    &::placeholder {
      color: @tertiaryLabel;
    }
  }

  &__address {
    display: inline-block;
    width: auto;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: @tertiaryLabel;
  }

  &__info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: row;
    width: auto;
    text-decoration: none;
    position: relative;
    width: 100%;
    height: 100%;

    &-icon {
      width: 32px;
      height: 32px;
      background: @gray004;
      box-shadow: inset 0px 0px 1px @gray016;
      margin-right: 12px;
      border-radius: 50%;
    }

    img {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      border-radius: 50%;
    }
    &-name {
      width: 100%;
      p {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        color: @primaryLabel;
        margin: 0;
      }
      span {
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 22px;
        color: @tertiaryLabel;
        display: inline-block;
        margin-left: 4px;
      }
    }
    svg {
      position: absolute;
      top: 50%;
      right: 4px;
      margin-top: -12px;
    }
  }
}
</style>
