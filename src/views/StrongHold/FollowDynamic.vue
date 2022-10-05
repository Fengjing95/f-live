<!--
 * @Date: 2022-09-07 20:53:44
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-10-05 15:30:56
-->
<template>
  <template v-if="data.dynamic.total">
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
    <div class="paginator">
      <a-pagination
        :total="data.dynamic.total"
        :current="current"
        :page-size="pageSize"
        @page-size-change="(p) => (pageSize = p)"
        @change="
          async (c) => {
            current = c;
          }
        "
        show-total
        show-jumper
        show-page-size
      />
    </div>
  </template>
  <a-empty v-else />

  <!-- <div v-for="d in data.dynamic.content" :key="d.postId">
    {{ d.createTime }}
  </div> -->
</template>

<script setup lang="ts">
import type { DynamicDTO } from "#/citadel";
import type { PaginationResponseData } from "#/util";
import { getHomeDynamic } from "@/services/citadel";
import { onMounted, reactive, ref } from "vue";
import DynamicItem from "./components/DynamicItem.vue";

const data = reactive<{
  dynamic: PaginationResponseData<Required<DynamicDTO>>;
}>({
  dynamic: {
    content: [],
    total: 0,
  },
});

const current = ref(1);
const pageSize = ref(20);

onMounted(async () => {
  data.dynamic = await getHomeDynamic();
});
</script>

<style scoped lang="less">
.dynamic-container {
  padding: 32px 20px;
}

.paginator {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
</style>
