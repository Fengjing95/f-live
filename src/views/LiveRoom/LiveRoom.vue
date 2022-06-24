<!--
 * @Date: 2022-06-07 10:25:23
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-24 11:18:27
-->
<template>
  <!-- TODO 主播工具面板 -->
  <div class="room-anchor-channel" v-if="isAnchor">
    <a-row>
      <a-col :span="2"><facial-panel /></a-col>
      <a-col :span="2">2</a-col>
    </a-row>
  </div>

  <div class="room-container">
    <!-- 左侧区块 -->
    <div class="room-left">
      <div class="room-anchor-info">
        <div class="avatar">
          <a-avatar :size="92" shape="square">
            <img :src="room?.info?.anchor?.avatar || defaultAvatar" />
          </a-avatar>
        </div>

        <div class="title-line">
          <div class="title-header">
            <h3 class="title-header-content">{{ room.info.title }}</h3>
            <div class="title-header-fans">
              <div class="fans-num">
                <template v-if="room.info?.fans">{{ room.info.fans }}</template>
                <icon-loading v-else />
              </div>
              <div v-if="!room.isLike" class="follow-btn" @click="follow">
                <icon-heart-fill />关注
              </div>
              <div v-else class="follow-btn is-follow" @click="unFollow">
                已关注
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="room-video"></div>
      <div class="room-present"></div>
    </div>

    <!-- 右侧区块 -->
    <div class="room-right">
      <div class="room-person-info">
        <div><icon-user-group /> &nbsp;{{ room.personCount }}</div>
        <div v-if="room.info.isLiving">
          {{ fromNow(room.info.lastLiveTime) }}开播
        </div>
        <div v-else>未开播</div>
      </div>

      <div class="room-list">
        <div class="room-danmu-list" ref="msgListRef">
          <div class="danmu" v-for="msg in room.msgList" :key="msg.id">
            <!-- 主播在直播间发弹幕会有标识 -->
            <common-icon-font
              v-if="room.info.anchor.username === msg.fromUsername"
              type="icon-renzheng-"
            />
            <!-- TODO 昵称 click 显示用户信息 -->
            <span class="danmu-nickname">{{ msg.fromNickname }}: </span>
            {{ msg.msg }}
          </div>
        </div>

        <div class="room-join-message-container">
          <Transition name="join">
            <div v-if="join.user" class="room-join-message">
              <span class="danmu-nickname">{{ join.user }}</span> 进入直播间
            </div>
          </Transition>
        </div>
      </div>

      <div class="room-danmu-send">
        <!-- 登录之后可以发送弹幕 -->
        <template v-if="isLogin">
          <a-input
            placeholder="快来装填弹幕吧"
            :style="{ height: '100%', borderRadius: '3px 0 0 3px' }"
            :max-length="40"
            @keydown.enter="sendMessage"
            v-model="inputMessage"
          />
          <a-button
            type="primary"
            :style="{ height: '100%', borderRadius: '0 3px 3px 0' }"
            @click="sendMessage"
          >
            <icon-send />
          </a-button>
        </template>
        <template v-else>
          <div>
            <span class="room-danmu-login" @click="globalStore.startLogin"
              >登陆</span
            >
            后可以发送弹幕
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import type { MessageDTO, RoomInfoDTO } from "#/room";
import {
  followRoom,
  gerRoomFansNum,
  getRoomInfo,
  hasLikeRoom,
  unFollowRoom,
} from "@/services/room";
import { io } from "socket.io-client";
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import { afterLogin } from "@/utils/actionAfterLogin";
import {
  IconHeartFill,
  IconUserGroup,
  IconSend,
  IconLoading,
} from "@arco-design/web-vue/es/icon";
import { fromNow } from "@/utils/time";
import { useGlobalStore } from "@/stores/global";
import { CommonIconFont } from "@/utils/iconfontAdapter";
// 默认头像
const defaultAvatar = import.meta.env.VITE_ANCHOR_DEFAULT_AVATAR;

const userStore = useUserStore(); // pinia-user
const globalStore = useGlobalStore(); // pinia-global
const props = defineProps<{ roomId: string }>();

// 消息列表 元素 ref
const msgListRef = ref<HTMLDivElement>();
const room = reactive<{
  info: RoomInfoDTO;
  isLike: boolean;
  msgList: MessageDTO[];
  personCount: number;
}>({
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

// 弹幕输入框绑定值
const inputMessage = ref("");
// 发送弹幕
function sendMessage() {
  if (!inputMessage.value) return;
  // 发送消息
  socket.emit("serverMsgInRoom", {
    fromUsername: userStore.info.username,
    fromNickname: userStore.info.nickname,
    msg: inputMessage.value,
    roomId: props.roomId,
  });
  // 清除输入区域
  inputMessage.value = "";
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
    // 消息列表更新后定位到底部
    nextTick(() => {
      if (msgListRef.value)
        msgListRef.value.scrollTop = msgListRef.value.scrollHeight;
    });
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
    room.info.fans = await gerRoomFansNum(props.roomId);
  }
}
</script>

<style scoped lang="less">
@import "@/index.less";

// join 消息动画
.join-enter-from {
  transform: translateY(30px);
}
.join-enter-to {
  transform: translateY(0px);
}
.join-leave-from {
  transform: translateY(0px);
}
.join-leave-to {
  transform: translateY(-30px);
}

.join-enter-active,
.join-leave-active {
  transition: 0.5s;
}

.room-anchor-channel {
  height: 100px;
  width: 100%;
  border-radius: @custom_border-radius;
  border: @custom_border;
  // background-color: @custom_background-color;
}

.room-container {
  margin-top: 10px;
  width: @custom_width;
  height: 700px;
  display: flex;

  .room-left {
    background-color: @custom_background-color;
    flex: 3;
    margin-right: 12px;
    border-radius: @custom_border-radius;
    border: @custom_border;

    .room-anchor-info {
      padding: @custom_padding-small;
      height: 92px;
      box-sizing: border-box;
      display: flex;
      .avatar {
        margin-right: 8px;
      }
      .title-line {
        flex: 1;
        display: flex;
        flex-direction: column;
        .title-header {
          display: flex;
          .title-header-content {
            flex: 1;
            font-weight: 600;
          }

          .title-header-fans {
            border-radius: 13.5px;
            background-color: rgba(0, 0, 0, 0.05);
            color: #666;
            height: 24px;
            line-height: 24px;
            width: 138px;
            font-size: @custom_small-font;
            padding-left: 8px;
            .fans-num {
              width: 62px;
              text-align: center;
              display: inline-block;
            }
            .follow-btn {
              position: relative;
              display: inline-block;
              width: 68px;
              cursor: pointer;
              border-radius: 13.5px;
              background-color: @primary-custom;
              text-align: center;
              color: #fff;
            }
            .is-follow {
              background-color: #ccc;
            }
          }
        }
      }
    }
  }

  .room-right {
    background-color: @custom_background-color;
    flex: 1;
    border-radius: @custom_border-radius;
    border: @custom_border;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .room-person-info {
      height: 30px;
      background-color: #ffffff;
      border-bottom: @custom_border;
      align-items: center;
      padding: 0 10px;
      display: flex;
      div {
        flex: 1;
      }
    }
    .room-list {
      flex: 1;
      height: 0;
      display: flex;
      flex-direction: column;

      .room-danmu-list {
        flex: 1;
        height: 0;
        overflow-y: auto;
        .danmu {
          padding: 4px 16px;
        }
      }
      .danmu-nickname {
        color: @custom_link-color;
        cursor: pointer;
      }
      .room-join-message-container {
        overflow: hidden;
        max-height: 30px;
        .room-join-message {
          line-height: 30px;
          padding: 0 16px;
        }
      }
    }

    .room-danmu-send {
      height: 70px;
      border-top: @custom_border;
      background-color: #fff;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;

      .room-danmu-login {
        cursor: pointer;
        color: @primary-custom;
      }
    }
  }
}
</style>
