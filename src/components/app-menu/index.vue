<template>
  <div class="app-menu">
    <div class="app-menu__wrap">
      <router-link :to="{ name: 'main' }">Accounts</router-link>
      <router-link :to="{ name: 'send' }">Send</router-link>
      <router-link :to="{ name: 'stake' }">Stake</router-link>
      <router-link :to="{ name: 'crowdloan' }">Crowdloan</router-link>
      <router-link :to="{ name: 'claim' }">Claim DOT</router-link>

      <enkrypt-banner v-if="showLeftBanner" :is-left="true" />
    </div>

    <!-- <a href="#" class="app-menu__more">More</a> -->
  </div>
</template>

<script setup lang="ts">
import EnkryptBanner from "@/components/enkrypt-banner/index.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const showLeftBanner = computed(() => {
  return (
    route.name == "send" ||
    route.name == "send-verify" ||
    route.name == "invite"
  );
});
</script>

<style lang="less" scoped>
@import "@/assets/styles/theme.less";

.app-menu {
  height: 100vh;
  box-sizing: border-box;
  padding-top: 138px;
  position: fixed;
  width: 18.245%;
  left: 0;
  top: 0;
  z-index: 1;

  .screen-xl({
    padding-top: 96px;
  });

  .screen-sm({
    display: none;
  });

  @media (min-width: 1200px) {
    width: 21.166%;
  }
  @media (min-width: 1400px) {
    width: 21.214%;
  }
  @media (min-width: 1440px) {
    width: 20%;
  }

  &__wrap {
    box-sizing: border-box;
    padding-left: 96px;
    padding-right: 24px;
    position: relative;
    .sizing();

    .screen-xl({
      padding-left: 80px;
    });

    .screen-lg({
      padding-left: 24px;
      padding-right: 16px;
    });

    a {
      .body1__Meduim();
      .transition(color, 0.3s);
      color: @secondaryLabel;
      text-decoration: none;
      display: block;
      margin-bottom: 20px;

      &:hover {
        color: @primaryLabel;
      }

      &:active {
        color: @tertiaryLabel;
      }

      &.router-link-active {
        color: @accent;
      }
    }

    .enkrypt-banner {
      margin-top: 44px;
    }
  }

  &__more {
    position: absolute;
    bottom: 57px;
    left: 96px;
    .body1__Meduim();
    .transition(color, 0.3s);
    color: @secondaryLabel;
    text-decoration: none;
    display: block;

    &:hover {
      color: @primaryLabel;
    }

    &:active {
      color: @tertiaryLabel;
    }

    .screen-xl({
      left: 80px;
    });

    .screen-lg({
      left: 24px;
    });
  }
}
</style>
