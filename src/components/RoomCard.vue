RoomDTO
<!--
 * @Date: 2022-06-06 17:12:13
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 直播间展示卡片
 * @LastEditTime: 2022-06-27 11:15:50
-->
<template>
  <a-card class="room-card" hoverable>
    <template #actions>
      <a-tooltip content="前往直播间" position="top" mini>
        <span class="icon-hover" @click="openLive">
          <icon-live-broadcast />
        </span>
      </a-tooltip>
      <a-tooltip content="前往根据地" position="top" mini>
        <span class="icon-hover" @click="openStrongHold">
          <icon-relation />
        </span>
      </a-tooltip>
    </template>
    <template #cover>
      <div class="live-image">
        <!-- 最佳比例: 286:160 -->
        <img
          class="image"
          loading="lazy"
          :style="{ width: '100%' }"
          :alt="anchor.nickname"
          :src="room.image"
          @click="openLive"
        />
        <div class="mask" v-if="!room.isLiving">
          <div class="info-wrapper">
            <p class="info-head"><icon-clock-circle /> 上次开播</p>
            <p>{{ utcToLocal(room.lastLiveTime) }}</p>
          </div>
        </div>
      </div>
    </template>
    <a-card-meta :title="room.title" :description="classification.className">
      <template #avatar>
        <div
          :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }"
        >
          <a-avatar :size="24" :style="{ marginRight: '8px' }">
            <img :src="anchor.avatar" />
          </a-avatar>

          <a-typography-text>{{ anchor.nickname }}</a-typography-text>
        </div>
      </template>
    </a-card-meta>
  </a-card>
</template>

<script setup lang="ts">
import type { UserInfoDTO } from "#/user";
import {
  IconLiveBroadcast,
  IconRelation,
  IconClockCircle,
} from "@arco-design/web-vue/es/icon";
import { useRouter } from "vue-router";
import { utcToLocal } from "@/utils/time";
import type { Classification } from "#/class";
import type { RoomDTO } from "#/room";

const props = defineProps<{
  room: RoomDTO;
  anchor: UserInfoDTO;
  classification: Classification;
}>();

const router = useRouter();

// 打开直播间新标签页
function openLive() {
  const { href } = router.resolve({
    name: "live",
    params: { roomId: props.room.roomId },
  });
  window.open(href, "_blank");
}

// 打开根据地新标签页
function openStrongHold() {
  const { href } = router.resolve({
    name: "live",
    params: { roomId: props.room.roomId },
  });
  window.open(href, "_blank");
}
</script>

<style scoped lang="less">
.room-card {
  width: 288px;
  transition-property: all;
  &:hover {
    transform: translateY(-4px);
  }
}
.icon-hover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.1s;
}
.icon-hover:hover {
  background-color: rgb(var(--gray-2));
}

.live-image {
  height: 160.48px;
  overflow: hidden;
  position: relative;
  .image {
    transition: all 0.3s;
    cursor: pointer;
    &:hover {
      transform: scale(1.2, 1.2);
      transition: all 0.5s;
    }
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);

    .info-wrapper {
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: inline-block;
      padding-top: 10px;
      font-size: 14px;
      color: #fff;

      & > p {
        margin: 0 auto;
        text-align: center;
      }

      .info-head {
        background-image: url("../assets/images/record-mask.webp");
        width: 152px;
        height: 30px;
        line-height: 30px;
      }
    }
  }
}
</style>
