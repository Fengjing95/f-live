/*
 * @Date: 2022-05-15 09:41:04
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-11-01 20:18:52
 */
import type { Citadel } from "#/citadel";
import type { UserInfoDTO } from "#/user";
import { getMyCitadel } from "@/services/citadel";
import { getMyInfo, logout, refreshToken } from "@/services/user";
import { setUserInStorage } from "@/utils/storage";
import { defineStore } from "pinia";
// import { useGlobalStore } from "./global";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    info: {} as UserInfoDTO,
    citadel: {} as Citadel,
    token: "",
  }),
  getters: {
    getToken(state) {
      return "Bearer " + state.token;
    },
    getUsername(state) {
      return state.info.username;
    },
    getPhoneAndHiddenPart(state) {
      return state.info.phone?.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
    },
    isAnchor(state) {
      return state.info.role === 1;
    },
  },
  actions: {
    async logout() {
      await logout();
      this.$reset();
    },
    // 设置 token
    setToken(token: string) {
      this.token = token;
    },
    // 刷新 token
    async refreshToken() {
      try {
        const token = await refreshToken();
        return (this.token = token);
      } catch (error) {
        return await Promise.reject(error);
      }
    },
    async getUserInfo() {
      const user = await getMyInfo();
      setUserInStorage(user);
      this.info = user;
    },
    mergeInfo(newInfo: Partial<UserInfoDTO>) {
      Object.assign(this.info, newInfo);
    },
    async getUserCitadelInfo() {
      const citadel = await getMyCitadel();
      this.citadel = citadel;
    },
  },
});
