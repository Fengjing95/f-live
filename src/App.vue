<!--
 * @Date: 2022-05-09 19:57:46
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-10-04 10:22:18
-->
<script setup lang="ts">
import { RouterView, useRouter } from "vue-router";
import { useGlobalStore } from "./stores/global";
import { useUserStore } from "./stores/user";
import LoginModal from "./components/login/LoginModal.vue";
import { useNoticeStore } from "./stores/notice";
import { afterLogin } from "./mixins/actionAfterLogin";
import SharedWorker from "./workers/noticeSharedWorker?sharedworker";
import { provide, ref } from "vue";
import { IconNotification } from "@arco-design/web-vue/es/icon";
// import { request } from "./utils/request";

const router = useRouter();
const routes = router.getRoutes();

const global = useGlobalStore();
const user = useUserStore();
if (!user.token) {
  user.getUserInfo();
}

const port = ref<MessagePort>();
provide("noticeWorker", port);

function initNoticeWorker() {
  const worker = new SharedWorker();
  port.value = worker.port;

  // 注入到全局

  worker.port.start();
  worker.port.addEventListener("message", (e) => {
    switch (e.data.event) {
      // 连接到 sharedworker 时, 目前没有操作
      case "connected":
        worker?.port.postMessage({ event: "init", payload: user.token });
        break;

      // 全部已读
      //  TODO 触发已读的事件发送请求, 保存到本地, 共享事件
      case "readAll":
        notice.readAll();
        break;

      // 根据 ID 已读某条消息
      case "read":
        notice.readNoticeById(e.data.payload);
        break;

      // 新消息
      case "newNotice":
        notice.insertNoticeAtHead(e.data.payload);
        break;
    }
  });
}

const notice = useNoticeStore();
afterLogin(() => {
  notice.getNotice();
  initNoticeWorker();
});
// request.post("/anchor/streamKey")  .catch((res) => {
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
          width: '50%',
        }"
        :selected-keys="[router.currentRoute.value.matched[0]?.path]"
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

      <div class="user-toolbar">
        <!-- 动态渲染用户头像或者登录按钮 -->
        <template v-if="user.info?.userId">
          <div class="login-toolbar">
            <div class="user-avatar-action">
              <a-avatar class="user-avatar">
                <img alt="avatar" :src="user.info?.avatar" />
              </a-avatar>

              <!-- TODO 用户面板 hover -->
              <div class="user-panel">1</div>
            </div>
          </div>

          <!-- TODO 历史观看 -->
          <!-- 消息通知 -->
          <div class="action">
            <a-badge
              :offset="[2, -2]"
              :count="notice.notReadNumber"
              :max-count="99"
              :dotStyle="{
                height: '15px',
                lineHeight: '15px',
              }"
            >
              <icon-notification
                :size="26"
                @click="router.push('/member/notice')"
              />
            </a-badge>
          </div>
        </template>

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

* {
  position: static;
}

img {
  max-width: 100%;
}
</style>

<style scoped lang="less">
@import "@/index.less";
.menu-container {
  // margin: -14px -20px 0 -20px;
  width: 100%;
  min-width: @custom_width;
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  z-index: 9;
  .menu {
    box-sizing: border-box;
    width: @custom_width;
    display: flex;
    justify-content: space-between;
    // margin: 0 auto;
    .user-toolbar {
      display: flex;
      align-items: center;

      .login-toolbar {
        display: flex;
        align-items: center;
        margin-right: 30px;

        .user-avatar-action {
          position: relative;
          .user-avatar {
            cursor: pointer;
            transition: 0.4s;
          }

          .user-panel {
            // opacity: 0;
            display: none;
            position: absolute;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            width: 210px;
            background-color: #fff;
            box-shadow: 0 0 10px 2px rgb(0 0 0 / 6%);
          }

          &:hover {
            .user-avatar {
              transform: scale(1.7) translate(0, 15px);
              z-index: 19;
            }
            .user-panel {
              display: block;
              z-index: 18;
              // opacity: 1;
            }
          }
        }
      }

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

      .action {
        cursor: pointer;
        // &:hover {
        //   transform: translateY(-5px);
        // }
      }
    }
  }
}

.content-container {
  width: 100%;
  min-width: @custom_width;
  display: flex;
  justify-content: center;
  padding: 82px 0 20px 0;
  .content {
    width: @custom_width;
  }
}
</style>
