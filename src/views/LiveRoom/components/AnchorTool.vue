<!--
 * @Date: 2022-06-25 12:38:27
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 主播面板
 * @LastEditTime: 2022-06-25 12:43:26
-->
<template>
  <!-- TODO 主播工具面板 -->
  <div class="room-anchor-channel">
    <a-row>
      <a-col :span="2"><facial-panel /></a-col>
      <a-col :span="2">2</a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
@import "@/index.less";

.room-anchor-channel {
  height: 100px;
  width: 100%;
  border-radius: @custom_border-radius;
  border: @custom_border;
  margin-bottom: 10px;
  // background-color: @custom_background-color;
}
</style>
