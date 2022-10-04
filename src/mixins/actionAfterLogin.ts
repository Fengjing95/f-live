/*
 * @Date: 2022-06-08 15:00:48
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 登陆之后处理
 * @LastEditTime: 2022-06-08 15:11:45
 */

import { useUserStore } from "@/stores/user";
import { computed, watch } from "vue";

/**
 * @description: 登陆之后操作
 * @param {function} cb 登陆之后要进行的操作
 * @return {*}
 */
export function afterLogin(cb: () => void) {
  const userStore = useUserStore();
  const isLogin = computed(() => !!userStore.token);

  watch(
    isLogin,
    async () => {
      if (isLogin.value) {
        cb();
      }
    },
    { immediate: true }
  );

  return isLogin;
}
