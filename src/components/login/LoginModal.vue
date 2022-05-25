<!--
 * @Date: 2022-05-16 19:40:42
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-05-23 09:22:59
-->
<template>
  <!-- 登录框 -->
  <a-modal
    :width="460"
    v-model:visible="global.loginVisible"
    :mask-closable="false"
    @ok="global.overLogin"
    @cancel="
      () => {
        // 关闭弹框, 将模式更改为登录
        global.overLogin();
        mode = 'login';
      }
    "
    :footer="false"
    unmount-on-close
    draggable
  >
    <!-- 根据当前模式选择渲染登录表单还是注册表单 -->
    <template #title> {{ mode === "login" ? "登录" : "注册" }} </template>
    <login-form v-if="mode === 'login'" />
    <register-form v-else />
    <div class="change-button">
      <a
        class="jump-link"
        @click="() => changeMode('register')"
        v-if="mode === 'login'"
      >
        快速注册>
      </a>
      <a class="jump-link" @click="() => changeMode('login')" v-else>
        返回登录>
      </a>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
// import LoginForm from "./LoginForm.vue";
import { ref } from "vue";
import { useGlobalStore } from "../../stores/global";
const global = useGlobalStore();

// 当前模式: 登录 | 注册
let mode = ref<"login" | "register">("login");

/**
 * @description: 改变模式
 * @param {'login' | 'register'} newMode 新的模式
 * @return {*}
 */
function changeMode(newMode: "login" | "register") {
  mode.value = newMode;
}
</script>

<style scoped lang="less">
.change-button {
  text-align: center;
  .jump-link {
    color: #4d4646;
    font-size: 12px;
    cursor: pointer;
    margin: 0 auto;
    &:hover {
      color: #6c6262;
    }
  }
}
</style>
