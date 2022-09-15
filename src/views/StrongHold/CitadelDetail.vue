<!--
 * @Date: 2022-09-07 20:24:08
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-09-14 22:33:44
-->
<template>
  <a-page-header
    :style="{ background: 'var(--color-bg-2)' }"
    :title="data.info.name"
    :subtitle="data.info.description"
    @back="router.push('/citadel')"
  >
    <template #extra>
      <a-link
        :hoverable="false"
        status="warning"
        @click="router.push(`/live/${data.info.room?.roomId}`)"
        >去直播间
      </a-link>
    </template>

    <DynamicItem
      v-for="p in data.post.content"
      :key="p.postId"
      :dynamic="p"
      :citadelId="citadelId"
      @thumb="
        () => {
          p.isThumb = 1;
          p.thumbsCount++;
        }
      "
      @cancelThumb="
        () => {
          p.isThumb = 0;
          p.thumbsCount--;
        }
      "
    />
  </a-page-header>
</template>

<script setup lang="ts">
import type { CitadelInfoDTO, DynamicDTO } from "#/citadel";
import type { PaginationResponseData } from "#/util";
import { getCitadelInfo, getDynamicInCitadel, thumb } from "@/services/citadel";
import { onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import DynamicItem from "./components/DynamicItem.vue";

const props = defineProps<{ citadelId: number }>();
const router = useRouter();

const data = reactive<{
  post: PaginationResponseData<DynamicDTO>;
  info: CitadelInfoDTO;
}>({
  post: {
    content: [],
    total: 0,
  },
  info: {} as CitadelInfoDTO,
});

// 初始化加载数据
onMounted(async () => {
  data.info = await getCitadelInfo(props.citadelId);
  data.post = await getDynamicInCitadel(props.citadelId);
});

// 路由params 改变时重新请求
watch(
  () => props.citadelId,
  async (id) => {
    data.info = await getCitadelInfo(id);
    data.post = await getDynamicInCitadel(id);
  }
);
</script>

<style scoped></style>
