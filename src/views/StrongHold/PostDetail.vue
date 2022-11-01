<!--
 * @Date: 2022-09-12 10:43:22
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-11-01 20:59:53
-->
<template>
  <div class="post_container">
    <!-- 骨架屏 -->
    <post-skeleton v-show="!post.title" />
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

    <a-divider orientation="center">共 {{ total }} 条评论</a-divider>

    <!-- 输入框 -->
    <div class="reply_textarea">
      <a-avatar shape="square" :size="72">
        <img :src="user.info.avatar" />
      </a-avatar>
      <a-textarea
        style="flex: 1; margin: 0 10px"
        v-model="editReview.content"
        :placeholder="placeholder"
        allow-clear
      />
      <a-space direction="vertical">
        <a-button type="primary" @click="handlePostReview">发布评论</a-button>
        <a-button :disabled="!editReview.reviewId" @click="handleCancelReply">
          取消回复
        </a-button>
      </a-space>
    </div>

    <!-- 分页 -->
    <div class="paginator">
      <a-pagination
        :total="total"
        :current="current"
        :page-size="pageSize"
        @page-size-change="(p: number) => (pageSize = p)"
        @change="async (c: number) => (current = c)"
        show-jumper
        show-page-size
      />
    </div>

    <!-- 评论内容 -->
    <review-item
      v-for="r in review"
      :key="r.reviewId"
      :review="r"
      @reply="handleReply(r.reviewId, r.fromUser.nickname)"
      :currentUserId="user.info.userId"
      @reload="loadReview"
    />
  </div>
</template>

<script setup lang="ts">
import type { PostDetailDTO, ReviewDTO } from "#/post";
import {
  cancelThumb,
  delPostInCitadel,
  getPostDetail,
  getReviewInPost,
  postReview,
  thumb,
} from "@/services/citadel";
import { useUserStore } from "@/stores/user";
import { ref, onMounted, computed } from "vue";
import { utcToLocal } from "../../utils/time";
import {
  IconDelete,
  IconThumbUp,
  IconThumbUpFill,
} from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import { useRouter, useRoute } from "vue-router";
import PostSkeleton from "./components/PostSkeleton.vue";
import ReviewItem from "./components/ReviewItem.vue";
import { watch } from "vue";
import { reactive } from "vue";

const props = defineProps<{ citadelId: number; postId: number }>();

const post = ref<Partial<PostDetailDTO>>({
  content: "",
});

const review = ref<ReviewDTO[]>();

const total = ref(0); // 总评论数
const current = ref(1); // 当前页码
const pageSize = ref(20); // 页容量

const editReview = reactive<{
  reviewId?: number;
  nickname: string;
  content: string;
}>({
  nickname: "",
  content: "",
});

const user = useUserStore();
const router = useRouter();
const route = useRoute();

console.log(route.query.scroll);

// 输入框 placeholder
const placeholder = computed(() =>
  editReview.nickname ? `回复 @${editReview.nickname}:` : "在此输入你的想法"
);

// 加载评论
async function loadReview() {
  const reviewData = await getReviewInPost(
    props.postId,
    current.value,
    pageSize.value
  );
  review.value = reviewData.content;
  total.value = reviewData.total;
}

// 初始化数据
onMounted(async () => {
  post.value = await getPostDetail(props.citadelId, props.postId);
  await loadReview();
});

// 分页数据变化重新请求
watch([current, pageSize], () => {
  loadReview();
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

// 回复
function handleReply(reviewId: number, nickname: string) {
  editReview.reviewId = reviewId;
  editReview.nickname = nickname;
}

// 取消回复
function handleCancelReply() {
  editReview.reviewId = undefined;
  editReview.nickname = "";
}

// 发布评论
async function handlePostReview() {
  const success = await postReview(props.postId, {
    content: editReview.content,
    parentReview: editReview.reviewId,
  });

  if (success) {
    Message.success("发布成功");
    // 清空输入框
    editReview.reviewId = undefined;
    editReview.nickname = "";
    editReview.content = "";
    loadReview();
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

  .reply_textarea {
    display: flex;
  }

  .paginator {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
