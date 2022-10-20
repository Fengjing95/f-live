<!--
 * @Date: 2022-09-09 11:40:42
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 动态卡片 item
 * @LastEditTime: 2022-09-20 23:21:14
-->
<template>
  <div class="d_container">
    <div class="d_header">
      <!-- 作者信息, 根据地信息 -->
      <div class="d_header-avatar">
        <a-avatar>
          <img :src="props.dynamic.author.avatar" />
        </a-avatar>
      </div>
      <div class="d_header-info">
        <div>{{ props.dynamic.author.nickname }}</div>
        <div class="d_header-info-time">
          {{ utcToLocal(props.dynamic.createTime) }}
          <template v-if="props.showCitadel"
            >&nbsp;&nbsp; 发布于
            <span
              class="citadel-link"
              @click="
                router.push(`/citadel/${props.dynamic.citadel?.citadelId}`)
              "
              >{{ props.dynamic.citadel?.name }}
            </span>
          </template>
        </div>
      </div>
      <!-- 点赞评论 btn -->
      <div style="display: flex">
        <div
          class="d_header-thumb"
          :class="props.dynamic.isThumb ? 'active' : ''"
          @click="handleThumb"
        >
          <icon-thumb-up />{{ props.dynamic.thumbsCount || "赞" }}
        </div>
        <div class="d_header-thumb" @click="handleReview">
          <icon-message />{{ props.dynamic.reviewsCount || "评论" }}
        </div>
      </div>
    </div>
    <div class="d_text">
      <!-- 帖子文本内容 -->
      <div class="d_text-title" @click="openDetail">
        {{ props.dynamic.title }}
      </div>
      <div class="d_text-content">{{ props.dynamic.contentText }}</div>
    </div>
    <div class="d_images">
      <!-- 帖子图片内容 -->
      <!-- <template> -->
      <img
        v-for="(img, index) in props.dynamic.imageList"
        :key="img"
        :src="img"
        @click="checkImage(index)"
      />
      <a-image-preview-group
        v-model:visible="imageVisible"
        v-model:current="current"
        :srcList="props.dynamic.imageList"
        infinite
      />
      <!-- </template> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DynamicDTO } from "#/citadel";
import { utcToLocal } from "@/utils/time";
import { useRouter } from "vue-router";
import { IconThumbUp, IconMessage } from "@arco-design/web-vue/es/icon";
import { cancelThumb, thumb } from "@/services/citadel";
import { ref } from "vue";

const props = withDefaults(
  defineProps<{
    citadelId: number;
    dynamic: DynamicDTO;
    showCitadel?: boolean;
  }>(),
  { showCitadel: false }
);

const emit = defineEmits<{
  (event: "thumb"): void;
  (event: "cancelThumb"): void;
}>();

const router = useRouter();

// 多图预览
const imageVisible = ref(false);
const current = ref(1);
/**
 * 更改当前图片为点击图片,显示预览
 * @param index 图片索引
 */
function checkImage(index: number) {
  current.value = index;
  imageVisible.value = true;
}

// 点赞事件绑定
async function handleThumb() {
  if (props.dynamic.isThumb) {
    // 如果已经点赞就取消点赞
    const res = await cancelThumb(props.dynamic.postId);
    if (res) {
      emit("cancelThumb");
    }
  } else {
    // 否则点赞
    const res = await thumb(props.dynamic.postId);
    if (res) {
      emit("thumb");
    }
  }
}

function openDetail() {
  window.open(`/citadel/${props.citadelId}/post/${props.dynamic.postId}`);
}

// 评论事件绑定
async function handleReview() {
  // TODO 评论跳转
  window.open(
    `/citadel/${props.citadelId}/post/${props.dynamic.postId}?scroll=review`
  );
}
</script>

<style scoped lang="less">
.d_container {
  padding: 10px 0;

  // &:not(:last-of-type) {
  border-bottom: 1px solid #e1e0e0;
  // }

  .d_header {
    display: flex;
    align-items: center;
    .d_header-info {
      margin-left: 10px;
      flex: 1;
      .d_header-info-time {
        font-size: 12px;
        color: #999;
        .citadel-link {
          cursor: pointer;
          text-decoration: underline;
          color: @primary-custom;
        }
      }
    }

    .d_header-thumb {
      cursor: pointer;
      width: 70px;
      background-color: rgba(230, 229, 229, 0.825);
      padding: 5px 8px;
      border-radius: 8px;
      text-align: center;
      &:hover {
        color: @primary-custom;
      }

      &:first-of-type {
        margin-right: 5px;
      }
    }

    .active {
      color: @primary-custom;
    }
  }

  .d_text {
    padding: 0 50px;
    .d_text-title {
      font-size: 15px;
      cursor: pointer;
      display: inline-block;
    }

    .d_text-content {
      font-size: 13px;
      color: #999;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 3;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
  }

  .d_images {
    padding: 20px 50px 0 50px;
    img {
      width: 150px;
      height: 150px;
      border-radius: 12px;
      cursor: zoom-in;
      object-fit: cover;
      margin-right: 10px;
    }
  }
}
</style>
