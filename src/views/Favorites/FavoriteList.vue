RoomDTO
<!--
 * @Date: 2022-06-06 15:40:01
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-09-27 09:12:50
-->
<template>
  <div :style="{ paddingTop: '20px' }">
    <a-empty v-if="list.content.length === 0" :style="{ marginTop: '200px' }">
      <template #image>
        <icon-empty />
      </template>
      未关注任何直播间
    </a-empty>
    <a-row v-else :gutter="[16, 16]">
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
import { afterLogin } from "@/mixins/actionAfterLogin";
import { IconEmpty } from "@arco-design/web-vue/es/icon";
import type { RoomInfoDTO } from "#/room";
// TODO 分页
let list = reactive({
  page: 1,
  content: [] as RoomInfoDTO[],
  total: 0,
});

afterLogin(async () => {
  const res = await getFavoriteList();
  list.total = res?.total || 0;
  list.content = res?.content.map((r) => r.room) || [];
});
</script>

<style scoped lang="less"></style>
