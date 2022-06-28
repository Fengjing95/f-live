<!--
 * @Date: 2022-06-27 11:17:18
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 分类 item 组件
 * @LastEditTime: 2022-06-28 19:32:07
-->
<template>
  <div class="classification-card">
    <i class="classification-icon">
      <div>
        <img class="icon-content" :src="classInfo.classIcon" />
      </div>
    </i>
    {{ classInfo.className }}
  </div>
</template>

<script setup lang="ts">
import type { Classification } from "#/class";

defineProps<{ classInfo: Classification }>();
</script>

<style scoped lang="less">
@import "@/index.less";
.classification-card {
  width: 100%;
  height: 187px;
  box-sizing: border-box;
  padding: 13px 9px;
  border-radius: @custom_border-radius;
  border: @custom_border;
  transition: 0.15s;
  color: #666;
  text-align: center;
  cursor: pointer;
  &:hover {
    border: none;
    box-shadow: 0 0 12px 2px rgb(30 13 4 / 15%);
    transform: scale(1.1);
    color: @primary-custom;
  }

  .classification-icon {
    display: block;
    overflow: hidden;
    position: relative;

    .icon-content {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
