<!--
 * @Date: 2022-09-07 20:53:44
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-09-14 22:34:30
-->
<template>
  <div class="dynamic-container">
    <DynamicItem
      v-for="d in data.dynamic.content"
      :key="d.postId"
      :dynamic="d"
      :showCitadel="true"
      :citadelId="d.citadel.citadelId"
      @thumb="
        () => {
          d.isThumb = 1;
          d.thumbsCount++;
        }
      "
      @cancelThumb="
        () => {
          d.isThumb = 0;
          d.thumbsCount--;
        }
      "
    />
  </div>

  <!-- <div v-for="d in data.dynamic.content" :key="d.postId">
    {{ d.createTime }}
  </div> -->
</template>

<script setup lang="ts">
import type { DynamicDTO } from "#/citadel";
import type { PaginationResponseData } from "#/util";
import { getHomeDynamic } from "@/services/citadel";
import { onMounted, reactive } from "vue";
import DynamicItem from "./components/DynamicItem.vue";

const data = reactive<{
  dynamic: PaginationResponseData<Required<DynamicDTO>>;
}>({
  dynamic: {
    content: [],
    total: 0,
  },
});

onMounted(async () => {
  data.dynamic = await getHomeDynamic();
});
</script>

<style scoped lang="less">
.dynamic-container {
  padding: 32px 20px;
}
</style>
