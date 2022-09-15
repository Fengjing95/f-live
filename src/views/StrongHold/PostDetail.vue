<!--
 * @Date: 2022-09-12 10:43:22
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-09-12 10:44:32
-->
<template>
  <div>{{ props.postId }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{ citadelId: number; postId: number }>();
</script>

<style scoped></style>
