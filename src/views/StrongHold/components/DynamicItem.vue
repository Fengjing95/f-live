<!--
 * @Date: 2022-09-09 11:40:42
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 动态卡片 item
 * @LastEditTime: 2022-09-14 22:35:33
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
      <div
        class="d_header-thumb"
        :class="props.dynamic.isThumb ? 'active' : ''"
        @click="handleThumb"
      >
        <icon-thumb-up />{{ props.dynamic.thumbsCount ?? "赞" }}
      </div>
    </div>
    <div class="d_text">
      <!-- 帖子文本内容 -->
      <div
        class="d_text-title"
        @click="
          router.push(
            `/citadel/${props.citadelId}/post/${props.dynamic.postId}`
          )
        "
      >
        {{ props.dynamic.title }}
      </div>
      <div class="d_text-content">{{ props.dynamic.contentText }}</div>
    </div>
    <div class="d_images">
      <!-- 帖子图片内容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DynamicDTO } from "#/citadel";
import { utcToLocal } from "@/utils/time";
import { useRouter } from "vue-router";
import { IconThumbUp } from "@arco-design/web-vue/es/icon";
import { cancelThumb, thumb } from "@/services/citadel";

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
</script>

<style scoped lang="less">
.d_container {
  padding: 10px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e1e0e0;
  }

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
    }

    .d_text-content {
      font-size: 13px;
      color: #999;
    }
  }

  .d_images {
  }
}
</style>
