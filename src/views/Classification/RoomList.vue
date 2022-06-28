<!--
 * @Date: 2022-06-26 18:02:16
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-27 15:44:31
-->
<template>
  <div class="room-list">
    <a-row :gutter="[16, 16]">
      <a-col :span="6" v-for="room in rooms" :key="room.roomId">
        <room-card
          :room="room"
          :anchor="room.anchor"
          :classification="room.classification" /></a-col
    ></a-row>
  </div>
</template>

<script setup lang="ts">
import type { RoomDTO } from "#/room";
import { getRoomsByClassId } from "@/services/class";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import RoomCard from "@/components/RoomCard.vue";

const route = useRoute();
const rooms = ref<RoomDTO[]>([]);

onMounted(async () => {
  rooms.value = await getRoomsByClassId(route.params.classKey as string);
});
</script>

<style scoped lang="less"></style>
