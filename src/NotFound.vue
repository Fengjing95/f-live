<!--
 * @Date: 2022-10-08 16:51:59
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 404
 * @LastEditTime: 2022-10-08 17:07:29
-->
<template>
  <div class="not_found"></div>
  <div class="text">Not Found</div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.not_found {
  width: 100%;
  height: 400px;
  background: url("@/assets/images/not-found.png") no-repeat 50%;
  background-size: 30%;
}

.text {
  background: -webkit-linear-gradient(315deg, #f9d423 25%, #ff4e50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  font-size: 90px;
}
</style>
