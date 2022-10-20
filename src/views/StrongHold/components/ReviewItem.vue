<!--
 * @Date: 2022-09-19 20:58:34
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 评论 item
 * @LastEditTime: 2022-09-20 23:13:34
-->
<template>
  <div class="review_container">
    <a-comment :datetime="fromNow(props.review.createTime)" align="right">
      <!-- 操作 -->
      <template #actions>
        <span
          class="action"
          key="delete"
          @click="handleDeleteReview"
          v-if="review.fromUser.userId === props.currentUserId"
        >
          <icon-delete /> 删除
        </span>
        <span class="action" key="reply" @click="emit('reply')">
          <icon-message /> 回复
        </span>
      </template>

      <!-- 头像 -->
      <template #avatar>
        <a-avatar>
          <img :src="props.review.fromUser.avatar" />
        </a-avatar>
      </template>

      <!-- 用户 -->
      <template #author>
        {{ props.review.fromUser.nickname }}
        <template v-if="props.review.parentReview">
          <span style="color: #8a919f; padding: 0 5px">回复</span>
          {{ props.review.parentReview.fromUser.nickname }}
        </template>
      </template>

      <!-- 评论内容 -->
      <template #content>
        {{ props.review.content }}
        <div class="reply_container" v-if="props.review.parentReview">
          "
          <div class="reply_content">
            {{ props.review.parentReview.content }}
          </div>
          "
        </div>
      </template>
    </a-comment>
  </div>
</template>

<script setup lang="ts">
import type { ReviewDTO } from "#/post";
import { fromNow } from "../../../utils/time";
import { IconMessage, IconDelete } from "@arco-design/web-vue/es/icon";
import { deleteReview } from "@/services/citadel";
import { Message } from "@arco-design/web-vue";

const props = defineProps<{ review: ReviewDTO; currentUserId: string }>();
const emit = defineEmits<{
  (e: "reply"): void;
  (e: "reload"): void;
}>();

// 删除评论
async function handleDeleteReview() {
  const success = await deleteReview(props.review.reviewId);
  if (success) {
    Message.success("删除成功");
    emit("reload");
  }
}
</script>

<style scoped lang="less">
.review_container {
  margin: 18px 0;
  white-space: pre-line;
  .reply_container {
    background-color: #f2f3f5;
    border-radius: 4px;
    color: #8a919f;
    padding: 0 12px;
    line-height: 36px;
    height: 36px;
    display: flex;
    margin-top: 8px;
    .reply_content {
      flex-shrink: 1;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
  }
}

.action {
  display: inline-block;
  padding: 0 4px;
  color: var(--color-text-1);
  line-height: 24px;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
}
.action:hover {
  background: var(--color-fill-3);
}
</style>
