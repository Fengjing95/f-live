RoomDTO
<!--
 * @Date: 2022-06-06 15:40:01
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-26 18:27:31
-->
<template>
  <div :style="{ paddingTop: '20px' }">
    <a-row :gutter="[16, 16]">
      <a-col :span="6" v-for="item in list.content" :key="item.roomId">
        <room-card
          :room="item"
          :anchor="item.anchor"
          :classification="item.classification"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { getFavoriteList } from "@/services/favorite";
import { reactive } from "vue";
import RoomCard from "@/components/RoomCard.vue";
import { afterLogin } from "@/utils/actionAfterLogin";
import type { RoomDTO } from "#/room";
// TODO 分页
let list = reactive({
  page: 1,
  content: [] as RoomDTO[],
  total: 0,
});

afterLogin(async () => {
  const res = await getFavoriteList();
  list.total = res?.total || 0;
  list.content = res?.content.map((r) => r.room) || [];
});
</script>

<style scoped lang="less"></style>
