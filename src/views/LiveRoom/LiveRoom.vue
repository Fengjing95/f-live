<!--
 * @Date: 2022-06-07 10:25:23
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-05 10:49:57
-->
<template>
  <anchor-tool v-if="isAnchor" />

  <div class="room-container">
    <!-- 左侧区块 -->
    <div class="room-left">
      <title-bar :room="room" :follow="follow" :unFollow="unFollow" />
      <div class="room-video"></div>
      <div class="room-present">
        <present-bar />
      </div>
    </div>

    <!-- 右侧区块 -->
    <div class="room-right">
      <chat-area
        @sendMessage="sendMessage"
        :room="room"
        :join="join"
        :isLogin="isLogin"
        ref="messageChildRef"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import type { MessageDTO, Room, RoomInfoDTO } from "#/room";
import {
  followRoom,
  gerRoomFansNum,
  getRoomInfo,
  hasLikeRoom,
  unFollowRoom,
} from "@/services/room";
import { io } from "socket.io-client";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { afterLogin } from "@/utils/actionAfterLogin";

import PresentBar from "./components/PresentBar.vue";
import TitleBar from "./components/TitleBar.vue";
import ChatArea from "./components/ChatArea.vue";
import AnchorTool from "./components/AnchorTool.vue";

const userStore = useUserStore(); // pinia-user

const props = defineProps<{ roomId: string }>();

// 子组件元素 ref
const messageChildRef = ref();
const room = reactive<Room>({
  info: {} as RoomInfoDTO,
  isLike: false,
  msgList: [],
  personCount: 0,
}); // 房间信息

//! 添加弹幕消息, 最多保存 300 条
function saveMsgWithLimit300(msg: MessageDTO) {
  if (room.msgList.length >= 300) {
    room.msgList.shift();
  }
  room.msgList.push(msg);
}

const timer = ref<number>();
// 进入直播间用户
const join = reactive<{ user: string }>({
  user: "",
});
// 加入房间消息
function joinMsgCtrl(nickname: string) {
  if (timer.value) {
    clearTimeout(timer.value);
  }
  join.user = nickname;
  setTimeout(() => {
    join.user = "";
  }, 3000);
}

// 当前用户是否是当前直播间主播
const isAnchor = computed(
  () => isLogin.value && userStore.info?.userId === room.info.anchor?.userId
);

// socket 实例
const socket = initSocket();

// 登录标识
const isLogin = afterLogin(async () => {
  room.isLike = await hasLikeRoom(props.roomId);
  socket.emit("serverJoin", {
    fromUsername: userStore.info.username,
    fromNickname: userStore.info.nickname,
    roomId: props.roomId,
  });
});

// 挂载完成时开始连接 socket
onMounted(async () => {
  // 游客登录
  socket.emit("serverJoin", {
    roomId: props.roomId,
    fromUsername: "guest",
  });

  room.info = await getRoomInfo(props.roomId);

  document.title = room.info.anchor.nickname + "_" + room.info.title;
  // 网页销毁时关闭 socket 连接
  // BUG: 不生效
  window.addEventListener("beforeunload", overSocket);
});

// 离开页面时关闭 socket 连接
onUnmounted(() => {
  overSocket();
  window.removeEventListener("beforeunload", overSocket);
});

// 发送弹幕
function sendMessage(message: string) {
  // 发送消息
  socket.emit("serverMsgInRoom", {
    fromUsername: userStore.info.username,
    fromNickname: userStore.info.nickname,
    msg: message,
    roomId: props.roomId,
  });
}

// 初始化 socket
function initSocket() {
  let socket = io(import.meta.env.VITE_SOCKET_ROOM);
  // 用户加入房间
  socket.on("clientJoin", (data) => {
    joinMsgCtrl(data.nickname);
  });

  // 房间人数
  socket.on("clientRoomPersonCount", (data) => {
    room.personCount = data.count;
  });

  // 弹幕消息
  socket.on("clientMsgInRoom", (data: MessageDTO) => {
    // 同一时间用户只能发送一条消息, 用户名+时间戳作为 key
    data.id = data.fromUsername + new Date().getTime();
    saveMsgWithLimit300(data);
    messageChildRef.value.scrollBottom();
  });
  // 返回 socket 实例
  return socket;
}

// 断开 socket
function overSocket() {
  socket.emit("serverLeave", { roomId: props.roomId });
  socket.close();
}

// 关注
async function follow() {
  const res = await followRoom(props.roomId);
  if (res) {
    room.isLike = true;
    room.info.fans = await gerRoomFansNum(props.roomId);
  }
}
// 取消关注
async function unFollow() {
  const res = await unFollowRoom(props.roomId);
  if (res) {
    room.isLike = false;
    room.info.fans = (await gerRoomFansNum(props.roomId)) || 0;
  }
}
</script>

<style scoped lang="less">
@import "@/index.less";

.room-container {
  // margin-top: 10px;
  width: @custom_width;
  height: 700px;
  display: flex;

  .room-left {
    background-color: @custom_background-color;
    flex: 3;
    margin-right: 12px;
    border-radius: @custom_border-radius;
    border: @custom_border;

    .room-video {
      height: 500px;
      background-color: #000;
    }

    .room-present {
      // background-color: red;
      height: 92px;
    }
  }

  .room-right {
    background-color: @custom_background-color;
    flex: 1;
    border-radius: @custom_border-radius;
    border: @custom_border;
    overflow: hidden;
  }
}
</style>
