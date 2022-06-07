<!--
 * @Date: 2022-05-09 19:57:46
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-07 19:32:59
-->
<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { useGlobalStore } from "./stores/global";
import { useUserStore } from "./stores/user";
import LoginModal from "./components/login/LoginModal.vue";
// import { request } from "./utils/request";

const router = useRouter();
const routes = router.getRoutes();

const global = useGlobalStore();
const user = useUserStore();
if (!user.info?.userId) {
  user.getUserInfo();
}
// request.post("/anchor/streamKey").catch((res) => {
//   console.log(res);
// });
// request.get("/user/myInfo").catch((res) => {
//   console.log(res);
// });
</script>

<template>
  <div class="menu-container">
    <div class="menu">
      <a-menu
        mode="horizontal"
        :style="{
          margin: '-7px -20px -10px -20px',
          backgroundColor: 'rgba(0,0,0,0)',
        }"
        :selected-keys="[router.currentRoute.value.path]"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '10px' }"
          disabled
        >
          <img src="@/assets/images/menu-logo.png" :width="80" :height="40" />
        </a-menu-item>
        <a-menu-item
          v-for="route in routes.filter((route) => route.meta.menuName)"
          :key="route.path"
          @click="router.push(route.path)"
        >
          <!-- 不需要登录 或者 已经登陆 -->
          <template v-if="!route.meta.needLogin || user.info?.userId">
            {{ route.meta.menuName }}
          </template>
        </a-menu-item>
      </a-menu>
      <div class="avatar">
        <!-- TODO 历史观看 -->
        <!-- TODO 消息通知 -->
        <!-- 动态渲染用户头像或者登录按钮 -->
        <a-avatar v-if="user.info?.userId">
          <img alt="avatar" :src="user.info?.avatar" />
        </a-avatar>
        <span class="unlogin" v-else @click="global.startLogin">&nbsp;</span>
      </div>
    </div>
  </div>
  <!-- 登录-->
  <login-modal />
  <!-- 路由组件 -->
  <div class="content-container">
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style>
@import "@/assets/base.css";
body {
  margin: 0 auto;
  padding: 0;
}
</style>

<style scoped lang="less">
.menu-container {
  // margin: -14px -20px 0 -20px;
  width: 100%;
  position: sticky;
  top: 0;
  display: flex;
  justify-content: center;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  z-index: 9;
  .menu {
    box-sizing: border-box;
    width: 1200px;
    display: flex;
    // margin: 0 auto;
    .avatar {
      display: flex;
      align-items: center;
      .unlogin {
        cursor: pointer;
        display: block;
        width: 52px;
        height: 52px;
        background-image: url("./assets/images/unlogin-sprite.webp");
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: auto 100%;
        animation: unloginAnimate 1s steps(1) infinite;
        -moz-background-size: auto 100%;
        -webkit-background-size: auto 100%;
        -webkit-animation: unloginAnimate 1s steps(1) infinite;
      }
    }
  }
}

.content-container {
  width: 100%;
  display: flex;
  justify-content: center;
  .content {
    width: 1200px;
  }
}
</style>
