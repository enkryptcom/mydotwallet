<template>
  <app-header />
  <app-menu />
  <div class="container">
    <div class="row justify-content-start">
      <div class="col-12">
        <main class="app__main">
          <router-view name="view"></router-view>
        </main>
        <main class="app__mobile">Please use this dapp<br />on desktop</main>
      </div>
    </div>
  </div>
  <router-view name="modal"></router-view>
</template>

<script setup lang="ts">
import AppHeader from "@/components/app-header/index.vue";
import AppMenu from "@/components/app-menu/index.vue";
</script>

<style lang="less">
@import "@/assets/styles/theme.less";

.app {
  position: relative;
  min-height: 100%;
  padding-bottom: 32px;
  box-sizing: border-box;
  padding-top: 96px;

  &__main {
    margin-top: 100px;

    .screen-sm({
      display: none;
    });
  }

  &__mobile {
    display: none;
    height: calc(~"100vh - 128px");
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: center;
    .body1__Meduim();
    color: @primaryLabel;

    .screen-sm({
      display: flex;
    });
  }
}
</style>
