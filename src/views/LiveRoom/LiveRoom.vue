<!--
 * @Date: 2022-06-07 10:25:23
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-10-25 11:24:32
-->
<template>
  <anchor-tool
    v-if="isAnchor"
    :isLive="room.info.isLiving"
    :isWebLive="isWebLive"
    @setLive="changeLiveStatus"
    @setLastLiveTime="changeLastLiveTime"
    @setStreamKey="changeStreamKey"
    @setWebLive="changeWebLive"
    @init="initPlayer"
    @destroy="playerRef?.destroy()"
  />

  <div class="room-container">
    <!-- 左侧区块 -->
    <div class="room-left">
      <title-bar :room="room" :follow="follow" :unFollow="unFollow" />
      <!-- 根据开播状态控制 -->
      <div class="room-video" id="mse" v-show="!isWebLive"></div>
      <div class="video-editor" v-show="isWebLive">
        <video
          class="video-screen"
          autoplay
          muted
          ref="screenRef"
          :width="screenOptions.width"
          :height="screenOptions.height"
        ></video>
        <VueDragResize
          v-show="isOpenCamera"
          :w="cameraOptions.width"
          :h="cameraOptions.height"
          :x="cameraOptions.left"
          :parentW="screenOptions.width"
          :parentH="screenOptions.height"
          :y="cameraOptions.top"
          @resizing="changeDimensions($event, -1)"
          @dragstop="changeDimensions($event, -1)"
          isDraggable
          isResizable
          parentLimitation
          aspectRatio
        >
          <video
            ref="cameraRef"
            autoplay
            muted
            :width="cameraOptions.width"
            :height="cameraOptions.height"
          />
        </VueDragResize>
        <template v-for="(item, index) in otherElements" :key="item.id">
          <VueDragResize
            v-if="item.visible"
            :w="item.rect.width"
            :h="item.rect.height"
            :x="item.rect.left"
            :y="item.rect.top"
            :parentW="screenOptions.width"
            :parentH="screenOptions.height"
            @resizing="changeDimensions($event, index)"
            @dragstop="changeDimensions($event, index)"
            isDraggable
            isResizable
            parentLimitation
          >
            <div
              :style="{
                color: item.style.color,
                textAlign: 'left',
                fontSize: item.style.fontSize,
                lineHeight: item.rect.height + 'px',
              }"
            >
              {{ item.text }}
            </div>
          </VueDragResize>
        </template>
      </div>
      <div class="room-present">
        <present-bar v-if="!isWebLive" />
        <web-live-tools
          v-else
          v-model:sourceMaterial="otherElements"
          :is-open-camera="isOpenCamera"
          :is-open-screen="isOpenScreen"
          @getCamera="getCamera"
          @getScreen="getScreen"
          @pushStream="pushStream"
          @cancelCamera="cancelCamera"
          @cancelScreen="cancelScreen"
        />
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
import type { MessageDTO, Room, RoomInfoDTO, SourceMaterialDTO } from "#/room";
import {
  followRoom,
  gerRoomFansNum,
  getRoomInfo,
  hasLikeRoom,
  unFollowRoom,
} from "@/services/room";
import { io } from "socket.io-client";
import { computed, nextTick, onMounted, onUnmounted, reactive, ref } from "vue";
import { afterLogin } from "@/mixins/actionAfterLogin";
import PresentBar from "./components/PresentBar.vue";
import TitleBar from "./components/TitleBar.vue";
import ChatArea from "./components/ChatArea.vue";
import AnchorTool from "./components/AnchorTool.vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VueDragResize from "vue3-drag-resize";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MultiStreamsMixer from "multistreamsmixer";
import "xgplayer";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import FlvPlayer from "xgplayer-flv.js";
import WebLiveTools from "./components/WebLiveTools.vue";
import { fetchWebLiveAddress, getRemoteOffer } from "@/services/anchor";

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

// 播放器
const playerRef = ref<FlvPlayer>();

// 挂载完成时开始连接 socket
onMounted(async () => {
  // 游客登录
  socket.emit("serverJoin", {
    roomId: props.roomId,
    fromUsername: "guest",
  });

  room.info = await getRoomInfo(props.roomId);
  document.title = room.info.anchor.nickname + "_" + room.info.title;

  // 在直播状态,并且没有处于网页开播模式
  if (room.info.isLiving && !isWebLive.value) {
    initPlayer();
  }
  // 网页销毁时关闭 socket 连接
  // BUG: 不生效
  window.addEventListener("beforeunload", overSocket);
});

// 初始化播放器
function initPlayer() {
  // if (playerRef.value) {
  //   playerRef.value.destroy();
  // }
  playerRef.value = new FlvPlayer({
    id: "mse", // 容器元素 ID
    url: import.meta.env.VITE_VIDEO_URL + room.info.streamKey + ".flv", // 拉流地址
    isLive: true, // 直播模式
    autoplay: true, // 自动播放
    height: 600, // 高
    width: 888, // 宽
    pip: true, // 画中画
    lang: "zh-cn",
    hasVideo: true,
    hasAudio: true,
    flvOptionalConfig: {
      enableWorker: true,
    },
    ignores: ["replay"], // 忽略内置控件
    danmu: {
      // danmu 配置
      comments: [],
    },
  });
}

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
    if (room.info.isLiving) {
      playerRef.value.danmu.sendComment({
        txt: data.msg,
        id: data.id,
        // TODO 弹幕样式可以进行扩展
        style: {
          color: "#ffffff",
          // 如果是自己的添加边框
          border:
            data.fromUsername === userStore.info.username
              ? "solid 1px #ffffff"
              : "none",
        },
      });
    }
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

// 更新直播状态
function changeLiveStatus(val: string | number | boolean) {
  room.info.isLiving = val as boolean;
}

// 更新开播时间
function changeLastLiveTime(val: string) {
  room.info.lastLiveTime = val;
}

// 更改串流秘钥
function changeStreamKey(val: string) {
  room.info.streamKey = val;
}

// 网页直播
const isWebLive = ref(false); // true 直播模式; false 观众模式
function changeWebLive(status: boolean) {
  isWebLive.value = status;
  if (!status) {
    setTimeout(initPlayer, 100);
  } else {
    nextTick(() => playerRef.value?.destroy());
  }
}

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface MixMediaStream extends MediaStream {
  fullcanvas?: boolean;
  width?: number;
  height?: number;
  top?: number;
  left?: number;
}

const screenStream = ref<MixMediaStream>();
const cameraStream = ref<MixMediaStream>();

// 屏幕捕获宽高
const screenOptions = reactive({
  width: 888,
  height: 600,
});
// 父容器高度,用于动态控制容器高度
const screenHeight = computed(() => screenOptions.height + "px");
const containerHeight = computed(() =>
  isWebLive.value ? screenOptions.height + 200 + "px" : "800px"
);
// 屏幕捕获视频
const screenRef = ref<HTMLVideoElement>();
// 是否开启屏幕捕获
const isOpenScreen = ref(false);
// 共享屏幕
function getScreen() {
  navigator.mediaDevices
    .getDisplayMedia({ video: true, audio: true })
    .then((stream) => {
      if (screenRef.value) screenRef.value.srcObject = stream;
      screenStream.value = stream;
    })
    .then(
      () =>
        new Promise((resolve) => {
          if (screenRef.value) screenRef.value.onloadedmetadata = resolve;
        })
    )
    .then(() => (isOpenScreen.value = true))
    .then(() => {
      const { videoHeight, videoWidth } = screenRef.value as HTMLVideoElement;
      const proportion = videoHeight / videoWidth;
      screenOptions.height = proportion * screenOptions.width;
      // 摄像头位置调整
      cameraOptions.top = screenOptions.height - cameraOptions.height;
      cameraOptions.left = screenOptions.width - cameraOptions.width;
    })
    .catch(console.error);
}
// 取消摄像头
function cancelScreen() {
  if (screenRef.value) {
    screenRef.value.srcObject = null;
    screenRef.value = undefined;
    isOpenScreen.value = false;
    // 停止使用资源
    screenStream.value?.getTracks().forEach((track) => {
      track.stop();
    });
  }
}

const cameraRef = ref<HTMLVideoElement>();
// 是否开启摄像头
const isOpenCamera = ref(false);
// 摄像头位置信息
const cameraOptions = reactive<Rect>({
  width: 200,
  height: 150,
  top: 450,
  left: 600,
});

// 其他元素
const otherElements = ref<SourceMaterialDTO[]>([
  {
    key: "1",
    visible: true,
    text: "test",
    rect: {
      width: 100,
      height: 40,
      top: 120,
      left: 120,
    },
    style: {
      color: "red",
      fontSize: "16px",
    },
  },
  {
    key: "2",
    visible: false,
    text: "title\nHow are you?",
    rect: {
      width: 100,
      height: 30,
      top: 220,
      left: 120,
    },
    style: {
      color: "blue",
      fontSize: "24px",
    },
  },
]);

// 捕获摄像头
function getCamera() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      if (cameraRef.value) cameraRef.value.srcObject = stream;
      cameraStream.value = stream;
    })
    // 加载完再执行后续
    .then(
      () =>
        new Promise((resolve) => {
          if (cameraRef.value) cameraRef.value.onloadedmetadata = resolve;
        })
    )
    // 显示视频元素
    .then(() => (isOpenCamera.value = true))
    // 调整视频比例
    .then(() => {
      const { videoHeight, videoWidth } = cameraRef.value as HTMLVideoElement;
      // 视频比例
      const proportion = videoWidth / videoHeight;
      // 根据比例转换
      cameraOptions.width = proportion * cameraOptions.height;
      // 摄像头位置调整
      cameraOptions.top = screenOptions.height - cameraOptions.height;
      cameraOptions.left = screenOptions.width - cameraOptions.width;
    })
    // 捕获异常
    .catch(console.log);
}

// 取消摄像头
function cancelCamera() {
  if (cameraRef.value) {
    cameraRef.value.srcObject = null;
    cameraRef.value = undefined;
    isOpenCamera.value = false;
    // 停止使用资源
    cameraStream.value?.getTracks().forEach((track) => {
      track.stop();
    });
  }
}

// 调整元素 size 和位置
function changeDimensions(newRect: Rect, idx: number) {
  if (idx === -1) {
    cameraOptions.left = newRect.left;
    cameraOptions.top = newRect.top;
    cameraOptions.width = newRect.width;
    cameraOptions.height = newRect.height;
  } else {
    otherElements.value[idx].rect = newRect;
  }
}

// 推流
function pushStream() {
  // BUG 文字元素+摄像头无法获得输出流,可能是 mixer 没有 fullcanvas 导致
  const canvas = document.createElement("canvas");
  canvas.width = screenOptions.width;
  canvas.height = screenOptions.height;

  function drawToCanvas() {
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.clearRect(0, 0, screenOptions.width, screenOptions.height);
    for (let i = 0; i < otherElements.value.length; i++) {
      const element = otherElements.value[i];
      if (!element.visible) continue;
      if (element.text) {
        context.font = `${element.style.fontSize} Microsoft YaHei`;
        context.fillStyle = element.style.color;
        context.fillText(
          element.text,
          element.rect.left,
          element.rect.top + element.rect.height
        );
      } else {
        // TODO image
      }
    }
    setTimeout(drawToCanvas, 1000);
  }

  let streams: MixMediaStream[] = [];

  if (isOpenScreen.value && screenStream.value) {
    screenStream.value.fullcanvas = true;
    screenStream.value.width = screenOptions.width;
    screenStream.value.height = screenOptions.height;
    streams.push(screenStream.value as MixMediaStream);
  }

  if (isOpenCamera.value && cameraStream.value) {
    cameraStream.value.width = cameraOptions.width;
    cameraStream.value.height = cameraOptions.height;
    cameraStream.value.top = cameraOptions.top;
    cameraStream.value.left = cameraOptions.left;
    streams.push(cameraStream.value as MixMediaStream);
  }

  if (otherElements.value.length) {
    drawToCanvas();
    const canvasStream = canvas.captureStream() as MixMediaStream;

    canvasStream.width = screenOptions.width;
    canvasStream.height = screenOptions.height;
    canvasStream.top = 0;
    canvasStream.left = 0;
    streams.push(canvasStream);
  }

  const PeerConnection = RTCPeerConnection;
  const SessionDescription = RTCSessionDescription;
  const pc = new PeerConnection();

  if (streams.length > 1) {
    // 如果大于一个流,混流
    const mixer = new MultiStreamsMixer(streams);
    mixer.frameInterval = 1;
    mixer.startDrawingFrames();
    mixer
      .getMixedStream()
      .getTracks()
      .forEach((track: MediaStreamTrack) => {
        pc.addTrack(track);
      });
    // playerRef.value.srcObject = mixer.getMixedStream();
  } else if (streams.length === 1) {
    // 否则直接输出
    // playerRef.value.srcObject = streams[0];
    streams[0].getTracks().forEach((track: MediaStreamTrack) => {
      pc.addTrack(track);
    });
  }

  // 交换 SDP
  fetchWebLiveAddress()
    .then(async (options) => {
      // 更新串流秘钥
      room.info.streamKey = options.streamKey;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      return getRemoteOffer({
        ...options,
        sdp: offer.sdp as string,
      });
    })
    .then((data) => {
      pc.setRemoteDescription(
        new SessionDescription({ type: "answer", sdp: data.data.sdp })
      );
    })
    .catch(console.error);
}
</script>

<style scoped lang="less">
@import "@/index.less";

.room-container {
  // margin-top: 10px;
  width: @custom_width;
  height: v-bind(containerHeight);
  display: flex;

  .room-left {
    background-color: @custom_background-color;
    flex: 3;
    margin-right: 12px;
    border-radius: @custom_border-radius;
    border: @custom_border;

    .room-video {
      height: 600px;
      background-color: #000;
      // height: v-bind(screenHeight);
      position: relative;
    }

    .video-editor {
      background-color: #000;
      height: v-bind(screenHeight);
      position: relative;
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
