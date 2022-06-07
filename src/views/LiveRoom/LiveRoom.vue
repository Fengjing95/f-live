<!--
 * @Date: 2022-06-07 10:25:23
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-07 19:41:59
-->
<template>
  <div>{{ roomId }}</div>
  房间人数{{ personCount }}
</template>

<script setup lang="ts">
// import { useUserStore } from "@/stores/user";
import { getUserFromStorage } from "@/utils/storage";
import { io } from "socket.io-client";
import { onMounted, onUnmounted, ref } from "vue";
const props = defineProps<{ roomId: string }>();

// const userStore = useUserStore();

const personCount = ref<number>(0); // 房间人数统计

// socket 实例
const socket = initSocket();

// 挂载完成时开始连接 socket
onMounted(() => {
  const user = getUserFromStorage();
  if (!user?.username) {
    // 如果没有用户数据, 游客登录
    socket.emit("serverJoin", {
      roomId: props.roomId,
      fromUsername: "guest",
    });
  } else {
    socket.emit("serverJoin", {
      fromUsername: user.username,
      fromNickname: user.nickname,
      roomId: props.roomId,
    });
  }

  // 网页销毁时关闭 socket 连接
  // BUG: 不生效
  window.addEventListener("beforeunload", overSocket);
});

// 离开页面时关闭 socket 连接
onUnmounted(() => {
  overSocket();
  window.removeEventListener("beforeunload", overSocket);
});

// 初始化 socket
function initSocket() {
  let socket = io(import.meta.env.VITE_SOCKET_PREFIX + "room");
  // 用户加入房间
  socket.on("clientJoin", (data) => {
    // TODO 加入房间, 游客不提醒
    console.log(data, "加入房间");
  });

  // 房间人数
  socket.on("clientRoomPersonCount", (data) => {
    personCount.value = data.count;
  });

  // 弹幕消息
  socket.on("clientMsgInRoom", (data) => {
    console.log("msg: ", data.msg);
  });
  // 返回 socket 实例
  return socket;
}

// 断开 socket
function overSocket() {
  socket.emit("serverLeave", { roomId: props.roomId });
  socket.close();
}
</script>

<style scoped lang="less"></style>
