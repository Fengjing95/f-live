<!--
 * @Date: 2022-09-12 10:43:22
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-09-18 22:45:40
-->
<template>
  <div class="post_container">
    <!-- 标题 -->
    <h1 class="post_title">{{ post.title }}</h1>

    <!-- 作者 -->
    <div class="post_author">
      <a-avatar>
        <img :src="post.author?.avatar" />
      </a-avatar>

      <div class="post_author-time">
        <div>{{ post.author?.nickname }}</div>
        <div style="color: #999">{{ utcToLocal(post.createTime || "") }}</div>
      </div>

      <!-- 删除 -->
      <div class="post_author-del">
        <s-space>
          <a-button type="text" @click="handleThumb">
            <template #icon>
              <icon-thumb-up v-if="!post.isThumb" />
              <icon-thumb-up-fill v-else />
            </template>
            {{ post.thumbs }}
          </a-button>
          <a-button
            v-if="post.author?.userId === user.info.userId"
            type="text"
            @click="handleDelete"
          >
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
        </s-space>
      </div>
    </div>

    <!-- 帖子内容 -->
    <div class="post_content" v-html="post.content"></div>

    <!-- TODO 评论 -->
  </div>
</template>

<script setup lang="ts">
import type { PostDetailDTO } from "#/post";
import {
  cancelThumb,
  delPostInCitadel,
  getPostDetail,
  thumb,
} from "@/services/citadel";
import { useUserStore } from "@/stores/user";
import { ref, onMounted } from "vue";
import { utcToLocal } from "../../utils/time";
import {
  IconDelete,
  IconThumbUp,
  IconThumbUpFill,
} from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import { useRouter, useRoute } from "vue-router";

const props = defineProps<{ citadelId: number; postId: number }>();

const post = ref<Partial<PostDetailDTO>>({
  content: "",
});

const user = useUserStore();
const router = useRouter();
const route = useRoute();

console.log(route.query.scroll);

// 初始化数据
onMounted(async () => {
  post.value = await getPostDetail(props.citadelId, props.postId);
});

// 点赞事件绑定
async function handleThumb() {
  if (post.value.isThumb) {
    // 如果已经点赞就取消点赞
    const res = await cancelThumb(props.postId);
    if (res) {
      post.value.isThumb = 0;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      post.value.thumbs--;
    }
  } else {
    // 否则点赞
    const res = await thumb(props.postId);
    if (res) {
      post.value.isThumb = 1;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      post.value.thumbs++;
    }
  }
}

// 删除
async function handleDelete() {
  const success = await delPostInCitadel(props.citadelId, props.postId);
  if (success) {
    Message.success("删除成功");
    router.push(`/citadel/${props.citadelId}`);
  }
}
</script>

<style scoped lang="less">
.post_container {
  padding: 10px 20px;
  .post_title {
    // text-align: center;
    margin: 0.3em 0;
  }

  .post_author {
    display: flex;
    margin-bottom: 10px;
    align-items: center;
    .post_author-time {
      margin-left: 20px;
      flex: 1;
    }
  }
  .active {
    color: @primary-custom;
  }

  .post_content {
  }
}
</style>
