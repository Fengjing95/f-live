<!--
 * @Date: 2022-10-02 20:23:42
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 通知组件
 * @LastEditTime: 2022-10-04 20:24:43
-->
<template>
  <div class="notice_item_container">
    <a-avatar :size="48">
      <img :src="props.notice.fromUser?.avatar" />
    </a-avatar>
    <div class="notice">
      <div class="notice_info">
        <div class="notice_from-user">
          {{ props.notice.fromUser?.nickname }}
        </div>

        <template v-if="props.notice.type === 'thumb'">
          点赞了你的帖子
        </template>
        <template v-else-if="props.notice.type === 'review'">
          评论了你的帖子
        </template>
        <template v-else-if="props.notice.type === 'reply'">
          回复了你在帖子
          <div class="notice_target" @click="goto">
            {{ props.notice.target?.title }}
          </div>
          下的评论
        </template>
        <div
          class="notice_target"
          v-if="props.notice.type !== 'reply'"
          @click="goto"
        >
          {{ props.notice.target?.title }}
        </div>
        <div class="notice_time">{{ fromNow(props.notice.createTime) }}</div>
      </div>

      <div class="notice_content" v-if="props.notice.type !== 'thumb'">
        {{ props.notice.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NoticeDTO } from "#/notice";
import { fromNow } from "@/utils/time";

const props = defineProps<{
  notice: NoticeDTO;
}>();

function goto() {
  window.open(
    `/citadel/${props.notice.target?.citadel.citadelId}/post/${props.notice.target?.postId}`
  );
}
</script>

<style scoped lang="less">
.notice_item_container {
  display: flex;
  align-items: flex-start;
  border: 1px solid #ccc;
  margin: 7px 0;
  padding: 8px;
  .notice {
    flex: 1;
    margin-left: 10px;
    .notice_info {
      height: 48px;
      line-height: 48px;
      display: flex;
      .notice_from-user {
        font-weight: 600;
        margin-right: 5px;
      }

      .notice_target {
        cursor: pointer;
        color: #409eff;
        margin: 0 5px;
      }

      .notice_time {
        flex: 1;
        text-align: right;
      }
    }

    .notice_content {
      background-color: #f2f3f5;
      border-radius: 4px;
      color: #8a919f;
      padding: 5px 10px;
    }
  }
}
</style>
