<!--
 * @Date: 2022-05-09 19:57:46
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-05-23 17:02:03
-->
<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { useGlobalStore } from "./stores/global";
import { useUserStore } from "./stores/user";
import { request } from "./utils/request";

const router = useRouter();
const routes = router.getRoutes();

const global = useGlobalStore();
const user = useUserStore();
request.get("/users/passport1/getSecret?username=fengjing").catch((res) => {
  console.log(res);
});
request.get("/users/passport/getSecret?username=fengjing").catch((res) => {
  console.log(res);
});
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
          v-for="route in routes"
          :key="route.path"
          @click="router.push(route.path)"
          >{{ route.meta.menuName }}</a-menu-item
        >
      </a-menu>
      <div>
        <!-- TODO 动态渲染用户头像或者登录按钮 -->
        <a-Button type="primary" v-if="user.token" @click="global.startLogin"
          >登录</a-Button
        >
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
