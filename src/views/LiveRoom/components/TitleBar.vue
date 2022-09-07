<!--
 * @Date: 2022-06-25 08:58:52
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-07-09 12:14:40
-->
<template>
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
            <template v-if="typeof room.info?.fans === 'number'">{{
              room.info.fans
            }}</template>
            <icon-loading v-else />
          </div>
          <div v-if="!room.isLike" class="follow-btn" @click="follow">
            <icon-heart-fill />关注
          </div>
          <a-popconfirm
            v-else
            content="确定要取消关注吗?"
            position="br"
            cancel-text="再想想"
            ok-text="狠心取关"
            @ok="unFollow"
          >
            <div class="follow-btn is-follow">已关注</div>
          </a-popconfirm>
        </div>
      </div>

      <div>
        <common-icon-font type="icon-maikefeng" />
        {{ room.info.anchor?.nickname }}
        <span
          class="room-classification"
          @click="
            router.push(`/classification/${room.info.classification.classKey}`)
          "
          >{{ room.info.classification?.className }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Room } from "#/room";
import { IconHeartFill, IconLoading } from "@arco-design/web-vue/es/icon";
import { useRouter } from "vue-router";
import { CommonIconFont } from "@/utils/iconfontAdapter";

// 默认头像
const defaultAvatar = import.meta.env.VITE_ANCHOR_DEFAULT_AVATAR;

const router = useRouter();

const props = defineProps<{
  room: Room;
  follow: () => void;
  unFollow: () => void;
}>();
</script>

<style scoped lang="less">
@import "@/index.less";
.room-anchor-info {
  padding: @custom_padding-small;
  height: 108px;
  // box-sizing: border-box;
  display: flex;
  .avatar {
    margin-right: 8px;
  }
  .title-line {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
          &:hover {
            opacity: 0.8;
          }
        }
        .is-follow {
          background-color: #ccc;
        }
      }
    }

    .room-classification {
      margin-left: 20px;
      color: #bababa;
      cursor: pointer;

      &:hover {
        color: @custom_link-color;
      }
    }
  }
}
</style>
