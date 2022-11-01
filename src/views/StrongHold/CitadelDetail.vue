<!--
 * @Date: 2022-09-07 20:24:08
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 根据地详情
 * @LastEditTime: 2022-11-01 20:56:59
-->
<template>
  <a-page-header
    :style="{ background: 'var(--color-bg-2)' }"
    :title="data.info?.name"
    :subtitle="data.info?.description"
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

    <div class="paginator">
      <a-pagination
        :total="data.post.total"
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

    <DynamicEditor @submit="savePost" />
  </a-page-header>
</template>

<script setup lang="ts">
import type { CitadelInfoDTO, DynamicDTO } from "#/citadel";
import type { PaginationResponseData } from "#/util";
import {
  getCitadelInfo,
  getDynamicInCitadel,
  publishPost,
} from "@/services/citadel";
import { onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import DynamicItem from "./components/DynamicItem.vue";
import DynamicEditor from "./components/DynamicEditor.vue";
import { Message } from "@arco-design/web-vue";
import { ref } from "vue";
import { nextTick } from "vue";

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

const current = ref(1);
const pageSize = ref(20);

async function load(id: number) {
  data.info = await getCitadelInfo(id);
  data.post = await getDynamicInCitadel(id, current.value, pageSize.value);
}

// 初始化加载数据
onMounted(async () => {
  load(props.citadelId);
});

// 路由params 改变时重新请求
watch(() => props.citadelId, load);

// 页码改变
watch([current, pageSize], async ([current, pageSize]) => {
  data.post = await getDynamicInCitadel(props.citadelId, current, pageSize);
});

async function reLoad() {
  if (current.value === 1) {
    data.post = await getDynamicInCitadel(
      props.citadelId,
      current.value,
      pageSize.value
    );
  }
  current.value = 1;
  nextTick(() => {
    window.scrollTo(0, 0);
  });
}

// 发布帖子
async function savePost(
  title: string,
  content: string,
  contentText: string,
  imageList?: string[],
  cb?: (res: boolean) => void
) {
  const success = await publishPost(props.citadelId, {
    title,
    content,
    contentText,
    imageList,
  });

  if (success) {
    Message.success("发布成功");
    // 动态定位
    reLoad();
    cb && cb(success);
  }
}
</script>

<style scoped lang="less">
.paginator {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
</style>
