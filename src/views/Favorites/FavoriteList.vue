<!--
 * @Date: 2022-06-06 15:40:01
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-21 20:01:16
-->
<template>
  <div :style="{ paddingTop: '20px' }">
    <a-row :gutter="[16, 16]">
      <a-col :span="6" v-for="item in list.content" :key="item.roomId">
        <room-card :room="item" :anchor="item.anchor" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { getFavoriteList } from "@/services/favorite";
import { reactive } from "vue";
import type { Room } from "#/favorite.d";
import RoomCard from "@/components/RoomCard.vue";
import { afterLogin } from "@/utils/actionAfterLogin";
// TODO 分页
let list = reactive({
  page: 1,
  content: [] as Room[],
  total: 0,
});

afterLogin(async () => {
  const res = await getFavoriteList();
  list.total = res?.total || 0;
  list.content = res?.content.map((r) => r.room) || [];
});
</script>

<style scoped lang="less"></style>
