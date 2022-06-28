<!--
 * @Date: 2022-06-25 10:26:15
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-28 15:37:27
-->
<template>
  <div class="message-container">
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
        <!-- TODO 表情面板 -->
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
</template>

<script setup lang="ts">
import type { Room } from "#/room";
import { useGlobalStore } from "@/stores/global";
import { IconUserGroup, IconSend } from "@arco-design/web-vue/es/icon";
import { fromNow } from "@/utils/time";
import { CommonIconFont } from "@/utils/iconfontAdapter";
import { nextTick, ref } from "vue";

defineExpose({
  scrollBottom,
});

const props = defineProps<{
  room: Room;
  join: { user: string };
  isLogin: boolean;
  // sendMessage: (message: string) => void;
}>();
const emit = defineEmits<{
  (e: "sendMessage", message: string): void;
}>();

const globalStore = useGlobalStore(); // pinia-global

// 弹幕输入框绑定值
const inputMessage = ref("");

function sendMessage() {
  if (!inputMessage.value) return;
  // props.sendMessage(inputMessage.value);
  emit("sendMessage", inputMessage.value);
  // 清除输入框内容
  inputMessage.value = "";
}

// 消息列表 元素 ref
const msgListRef = ref<HTMLDivElement>();

// 消息列表更新后定位到底部
function scrollBottom() {
  nextTick(() => {
    if (msgListRef.value)
      msgListRef.value.scrollTop = msgListRef.value.scrollHeight;
  });
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
  transform: translateY(30px);
}

.join-enter-active,
.join-leave-active {
  transition: 0.5s;
}

.message-container {
  height: 100%;
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
      max-height: 24px;
      .room-join-message {
        line-height: 24px;
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
</style>
