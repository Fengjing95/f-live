<!--
 * @Date: 2022-06-26 18:02:16
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-28 19:49:44
-->
<template>
  <div class="room-list">
    <a-empty v-if="rooms.length === 0" :style="{ marginTop: '200px' }">
      <template #image>
        <icon-empty />
      </template>
      该分类下暂无直播间
    </a-empty>
    <a-row v-else :gutter="[16, 16]">
      <a-col :span="6" v-for="room in rooms" :key="room.roomId">
        <room-card
          :room="room"
          :anchor="room.anchor"
          :classification="room.classification"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import type { RoomDTO } from "#/room";
import { getRoomsByClassId } from "@/services/class";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import RoomCard from "@/components/RoomCard.vue";
import { IconEmpty } from "@arco-design/web-vue/es/icon";

const route = useRoute();
const rooms = ref<RoomDTO[]>([]);

onMounted(async () => {
  rooms.value = await getRoomsByClassId(route.params.classKey as string);
});
</script>

<style scoped lang="less"></style>
