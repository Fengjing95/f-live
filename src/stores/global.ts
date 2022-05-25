import { defineStore } from "pinia";

/*
 * @Date: 2022-05-16 19:23:13
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-05-16 19:28:21
 */
export const useGlobalStore = defineStore({
  id: "global",
  state: () => ({
    loginVisible: false,
  }),
  actions: {
    startLogin() {
      this.loginVisible = true;
    },
    overLogin() {
      this.loginVisible = false;
    },
  },
});
