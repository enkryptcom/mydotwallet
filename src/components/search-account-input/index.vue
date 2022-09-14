<template>
  <div class="search-account-input">
    <div class="search-account-input__info">
      <img v-if="account" :src="account.image" />
      <div v-else class="search-account-input__info-icon"></div>
      <div class="search-account-input__info-name">
        <h5 class="search-account-input__title">To</h5>
        <input
          ref="inputRef"
          type="text"
          class="search-account-input__input"
          :class="{ sized: size != 1 && !isFocus }"
          placeholder="Search or paste Polkadot address"
          :value="value"
          :size="size"
          @focus="changeFocus"
          @blur="changeFocus"
        />
        <div
          v-if="size != 1 && !isFocus"
          class="search-account-input__address"
          @click="focus"
        >
          {{ $filters.replaceWithEllipsis(account?.address, 6, 6) }}
        </div>
      </div>
    </div>

    <dropdown-wrapper v-if="isOpenDropdown" ref="dropdown">
      <account-select
        :accounts="accounts"
        :recent="recent"
        @update:select-account="selectAccount"
      />
    </dropdown-wrapper>
  </div>
</template>

<script setup lang="ts">
import DropdownWrapper from "@/components/dropdown-wrapper/index.vue";
import AccountSelect from "@/components/account-select/index.vue";
import { Account } from "@/types/account";
import { PropType, ref, computed, ComponentPublicInstance } from "vue";
import { onClickOutside } from "@vueuse/core";

const isOpenDropdown = ref<boolean>(false);
const isFocus = ref<boolean>(false);
const dropdown = ref(null);
const inputRef = ref<ComponentPublicInstance<HTMLInputElement>>();
defineExpose({ inputRef });

const emit = defineEmits<{
  (e: "update:select", account: Account): void;
}>();

const props = defineProps({
  account: {
    type: Object as PropType<Account | null>,
    default: null,
  },
  accounts: {
    type: Object as PropType<Array<Account>>,
    default: () => ({}),
  },
  recent: {
    type: Object as PropType<Array<Account>>,
    default: () => ({}),
  },
});

const value = computed(() => {
  if (props.account == null) return null;
  if (isFocus.value) return props.account.address;
  return props.account.name ? props.account.name : props.account.address;
});

const size = computed(() => {
  if (props.account == null) return 1;
  return props.account.name ? props.account.name.length : 1;
});

const openAccounts = () => {
  isOpenDropdown.value = true;
};

const closeAccounts = () => {
  isOpenDropdown.value = false;
};

const changeFocus = (val: FocusEvent) => {
  isFocus.value = val.type === "focus";
  if (isFocus.value) openAccounts();
};

const selectAccount = (account: Account) => {
  emit("update:select", account);
  closeAccounts();
};

const focus = () => {
  if (inputRef.value) inputRef.value.focus();
};

onClickOutside(dropdown, () => {
  isFocus.value = false;
  closeAccounts();
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.search-account-input {
  width: 100%;
  height: 64px;
  display: block;
  text-decoration: none;
  position: relative;
  box-sizing: border-box;
  padding: 0 16px;
  border: 1px solid @gray01;
  border-radius: 16px;
  margin-bottom: 16px;

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
