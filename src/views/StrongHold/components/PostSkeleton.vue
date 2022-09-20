<!--
 * @Date: 2022-09-19 19:56:59
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 文章详情骨架屏
 * @LastEditTime: 2022-09-19 20:09:18
-->
<template>
  <a-skeleton animation>
    <a-space direction="vertical" :style="{ width: '100%' }" size="large">
      <a-skeleton-line :rows="1" :line-height="30" />
      <a-skeleton-shape shape="circle" />
      <a-skeleton-line :rows="5" />
    </a-space>
  </a-skeleton>
</template>
