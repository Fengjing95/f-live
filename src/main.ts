/*
 * @Date: 2022-05-09 19:57:46
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-05-24 14:25:30
 */
import { createApp } from "vue";
import { createPinia } from "pinia";

import ArcoVue from "@arco-design/web-vue";
import App from "./App.vue";
import "@arco-design/web-vue/dist/arco.css";
import router from "./router";

const app = createApp(App);

app.use(createPinia()).use(router).use(ArcoVue).mount("#app");
