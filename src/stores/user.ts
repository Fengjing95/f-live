/*
 * @Date: 2022-05-15 09:41:04
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-05-24 15:54:49
 */
import { refreshToken } from "@/services/user";
import { defineStore } from "pinia";
import { useGlobalStore } from "./global";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    username: "king",
    token: "",
  }),
  getters: {
    getToken(state) {
      return "Bearer " + state.token;
    },
  },
  actions: {
    // 设置 token
    setToken(token: string) {
      this.token = token;
    },
    // 刷新 token
    refreshToken() {
      return refreshToken()
        .then((token) => {
          return (this.token = token);
        })
        .catch((error) => {
          // 需要重新登录
          // useGlobalStore().startLogin();
          return Promise.reject(error);
        });
    },
  },
});
