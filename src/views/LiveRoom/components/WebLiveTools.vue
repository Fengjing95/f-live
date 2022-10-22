<!--
 * @Date: 2022-10-21 16:58:40
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 网页开播工具栏
 * @LastEditTime: 2022-10-22 20:14:19
-->
<template>
  <a-row class="grid-row">
    <a-col :span="2">
      <div
        class="tool-item"
        :class="props.isOpenScreen ? 'active' : ''"
        @click="handleScreen"
      >
        <common-icon-font
          type="icon-pingmugongxiang"
          :size="32"
          :style="{ position: 'relative', top: 13 }"
        />
        <br />
        屏幕共享
      </div>
    </a-col>

    <a-col :span="2">
      <div
        class="tool-item"
        :class="props.isOpenCamera ? 'active' : ''"
        @click="handleCamera"
      >
        <common-icon-font
          type="icon-luxiangji"
          :size="32"
          :style="{ position: 'relative', top: 13 }"
        />
        <br />
        摄像头
      </div>
    </a-col>

    <a-col :span="4" :offset="16">
      <a-button
        :style="{ marginTop: '25px' }"
        @click="handlePush"
        type="primary"
        shape="round"
      >
        开始推流
      </a-button>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { CommonIconFont } from "@/utils/iconfontAdapter";
const props = defineProps<{
  isOpenScreen: boolean;
  isOpenCamera: boolean;
}>();

const emit = defineEmits<{
  (e: "getCamera"): void;
  (e: "getScreen"): void;
  (e: "pushStream"): void;
  (e: "cancelCamera"): void;
  (e: "cancelScreen"): void;
}>();

function handleCamera() {
  if (props.isOpenCamera) emit("cancelCamera");
  else emit("getCamera");
}

function handleScreen() {
  if (props.isOpenScreen) emit("cancelScreen");
  else emit("getScreen");
}

function handlePush() {
  emit("pushStream");
}
</script>

<style scoped lang="less">
.grid-row {
  .arco-col {
    height: 92px;
    line-height: 40px;
    text-align: center;

    // &:not(:first-child) {
    //   border-left: 1px solid #e2e4e0;
    // }
  }

  .tool-item {
    cursor: pointer;
  }
  .active {
    color: @primary-custom;
  }
}
</style>
