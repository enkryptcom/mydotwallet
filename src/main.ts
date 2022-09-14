import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import * as filters from "./utils/filters";

const app = createApp(App);

app.use(router);

app.config.globalProperties.$filters = filters;

app.mount("#app");
