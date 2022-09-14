<template>
  <div v-if="recent !== null" class="account-select">
    <a class="account-select__link" @click="toggle">
      My accounts<expand-small :class="{ open: isOpen }" />
    </a>
    <div v-show="isOpen" class="account-select__list">
      <account-select-item
        v-for="(item, index) in accounts"
        :key="index"
        :account="item"
        @click="selectAccount(item)"
      />
    </div>
    <div class="account-select__link top-inset">Recent</div>
    <account-select-item
      v-for="(item, index) in recent"
      :key="index"
      :account="item"
      @click="selectAccount(item)"
    />
  </div>
  <div v-else class="account-select">
    <account-select-item
      v-for="(item, index) in accounts"
      :key="index"
      :account="item"
      @click="selectAccount(item)"
    />
  </div>
</template>

<script setup lang="ts">
import { Account } from "@/types/account";
import { PropType, ref } from "vue";
import ExpandSmall from "@/icons/common/expand-small.vue";
import AccountSelectItem from "./components/account-select-item.vue";

const isOpen = ref<boolean>(false);

const emit = defineEmits<{
  (e: "update:selectAccount", account: Account): void;
}>();

defineProps({
  account: {
    type: Object as PropType<Account>,
    default: null,
  },
  accounts: {
    type: Object as PropType<Array<Account>>,
    default: null,
  },
  recent: {
    type: Object as PropType<Array<Account>>,
    default: null,
  },
});

const selectAccount = (account: Account) => {
  emit("update:selectAccount", account);
};

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.account-select {
  background: @white;
  .sizing();

  &__link {
    display: block;
    text-decoration: none;
    cursor: pointer;
    padding: 0 16px;
    .body2__Medium();
    color: @secondaryLabel;
    .transition(color, 0.3s);
    margin: 0 0 4px 0;

    &.top-inset {
      margin-top: 16px;
      pointer-events: none;
    }

    svg {
      margin-left: 4px;
      display: inline-block;
      .transition(all, 0.3s);
      width: 16px;
      height: 16px;
      position: relative;
      top: 3px;
      opacity: 0.56;

      &.open {
        .rotate(90deg);
      }
    }

    &:hover {
      color: @primaryLabel;

      svg {
        opacity: 0.96;
      }
    }

    &:active {
      color: @tertiaryLabel;

      svg {
        opacity: 0.32;
      }
    }
  }
}
</style>
