<!--
 * @Date: 2022-10-08 21:25:00
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 用户卡片
 * @LastEditTime: 2022-10-10 22:34:05
-->
<template>
  <a-card :bordered="false">
    <a-space :size="54">
      <a-avatar :size="100" class="info-avatar">
        <template #trigger-icon>
          <a-upload
            list-type="picture-card"
            v-model:file-list="fileList"
            :show-upload-button="true"
            :show-file-list="false"
            :auto-upload="false"
            @change="uploadChange"
          >
            <template #upload-button>
              <icon-camera />
            </template>
          </a-upload>
        </template>
        <img :src="userStore.info.avatar" @click="visible = true" />
        <a-image-preview
          :src="userStore.info.avatar"
          v-model:visible="visible"
        />
      </a-avatar>

      <a-descriptions
        :data="renderData"
        :column="2"
        align="right"
        layout="inline-horizontal"
        :label-style="{
          width: '80px',
          fontWeight: 'normal',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{
          // width: '200px',
          paddingLeft: '8px',
          textAlign: 'left',
        }"
      >
        <template #label="{ label }">{{ label }} :</template>
        <template #value="{ value, data }">
          <a-tag
            v-if="data.label === '用户状态'"
            :color="value === '冻结' ? 'orange' : 'green'"
            size="small"
          >
            {{ value }}
          </a-tag>
          <span v-else-if="data.label === 'UID'">
            {{ value }}
            &nbsp;
            <icon-copy @click="copyUID" :style="{ cursor: 'pointer' }" />
          </span>
          <span v-else>{{ value }}</span>
        </template>
      </a-descriptions>
    </a-space>
  </a-card>

  <a-modal
    :visible="cropperVisible"
    title="上传头像"
    :width="650"
    :ok-loading="loading"
    @ok="uploadAvatar"
    @cancel="clearList"
  >
    <div class="cropper-container">
      <div class="cropper-main">
        <vue-cropper
          ref="cropperRef"
          :img="options.img"
          :outputType="options.outputType"
          :info="true"
          :canMove="options.canMove"
          :full="options.full"
          :canMoveBox="options.canMoveBox"
          :original="options.original"
          :autoCrop="options.autoCrop"
          :fixed="options.fixed"
          :fixedNumber="options.fixedNumber"
          :centerBox="options.centerBox"
          :infoTrue="options.infoTrue"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        />
      </div>

      <div class="preview">
        <div :style="previews?.div" class="preview-content-rect">
          <img :src="previews?.url" :style="previews?.img" />
        </div>

        <div :style="previews?.div" class="preview-content-circular">
          <img :src="previews?.url" :style="previews?.img" />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { IconCamera, IconCopy } from "@arco-design/web-vue/es/icon";
import { useUserStore } from "@/stores/user";
import type { DescData } from "@arco-design/web-vue/es/descriptions/interface";
import copy from "copy-to-clipboard";
import { Message, type FileItem } from "@arco-design/web-vue";
import { utcToLocal } from "@/utils/time";
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import { convertBase64UrlToBlob } from "@/utils/file";
import { postAvatar } from "@/services/user";

// 头像预览可见性
const visible = ref(false);

const userStore = useUserStore();

// descriptions options
const renderData = computed(() => {
  return [
    {
      label: "昵称",
      value: userStore.info?.nickname,
    },
    {
      label: "注册时间",
      value: utcToLocal(userStore.info.updateTime),
    },
    {
      label: "用户名",
      value: userStore.info?.username,
    },
    {
      label: "用户状态",
      value: userStore.info.freeze ? "冻结" : "正常",
    },
    {
      label: "UID",
      value: userStore.info.userId,
    },
  ] as DescData[];
});

// 裁剪器组件 ref
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cropperRef = ref<any>(null);
// 上传头像加载
const loading = ref(false);
// 文件列表
const fileList = ref<FileItem[]>([]);
// 裁剪面板可见性
const cropperVisible = computed(() => fileList.value.length > 0);
// 图片地址
const imgUrl = computed(() => fileList.value[0]?.url || "");
// 裁剪器配置
const options = reactive({
  img: imgUrl, // 裁剪图片的地址
  info: true, // 裁剪框的大小信息
  outputSize: 1, // 裁剪生成图片的质量
  outputType: "png", // 裁剪生成图片的格式
  canScale: true, // 图片是否允许滚轮缩放
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 300, // 默认生成截图框宽度
  autoCropHeight: 300, // 默认生成截图框高度
  fixedBox: false, // 固定截图框大小 不允许改变
  fixed: true, // 是否开启截图框宽高固定比例
  fixedNumber: [1, 1], // 截图框的宽高比例
  full: false, // 是否输出原图比例的截图
  canMoveBox: true, // 截图框能否拖动
  original: false, // 上传图片按照原始比例渲染
  high: true,
  centerBox: true, // 截图框是否被限制在图片里面
  infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  canMove: false, // 图片是否可以移动
});
const previews = ref<PreviewData>(); // 实时预览

interface PreviewData {
  w: number;
  url: string;
  img: Record<string, string>;
  div: Record<string, string | number>;
}

// 实时预览
function realTime(data: PreviewData) {
  data.div.zoom = 150 / data.w; // 150: 预览的固定宽度
  previews.value = data;
}

// 选择文件之后
function uploadChange(fileItemList: FileItem[], fileItem: FileItem) {
  fileList.value = [fileItem];
}

// 清空列表
function clearList() {
  fileList.value = [];
}

// 上传头像
function uploadAvatar() {
  loading.value = true;
  cropperRef.value?.getCropData(async (data: string) => {
    let file = convertBase64UrlToBlob(data, "image/png");

    const success = await postAvatar(file);
    if (success) {
      Message.success("上传成功");
      clearList();
      userStore.info.avatar = success;
    }
  });
  loading.value = false;
}

// 复制用户 ID 到剪贴板
function copyUID() {
  const success = copy(userStore.info.userId);
  if (success) Message.success("已复制到剪贴板");
  else Message.error("请重试");
}
</script>

<style scoped lang="less">
.arco-card {
  padding: 14px 0 4px 4px;
  border-radius: 4px;
}
:deep(.arco-avatar-trigger-icon-button) {
  width: 32px;
  height: 32px;
  line-height: 32px;
  background-color: #e8f3ff;
  .arco-icon-camera {
    margin-top: 8px;
    color: rgb(var(--arcoblue-6));
    font-size: 14px;
  }
}

.cropper-container {
  position: relative;
  display: flex;
  .cropper-main {
    width: 400px;
    height: 400px;
  }

  .preview {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    padding: 20px 0;
    .preview-content-circular {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      border: 3px solid #999;
      box-sizing: border-box;
      overflow: hidden;
      img {
        max-width: none;
      }
    }

    .preview-content-rect {
      width: 150px;
      height: 150px;
      border: 3px solid #999;
      box-sizing: border-box;
      overflow: hidden;
      img {
        max-width: none;
      }
    }
  }
}
</style>
