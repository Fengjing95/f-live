<!--
 * @Date: 2022-06-25 12:38:27
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 主播面板
 * @LastEditTime: 2022-10-21 14:30:32
-->
<template>
  <!-- 主播工具面板 -->
  <div class="room-anchor-channel">
    <a-row class="grid-row">
      <a-col :span="2">
        <a-tooltip
          content="开播之后请尽快将视频流推送到指定的地址"
          position="bottom"
        >
          <a-switch
            :before-change="handleChangeIntercept"
            :model-value="props.isLive"
            @change="(val) => emit('setLive', val)"
          />
          <br />
          {{ props.isLive ? "关闭直播" : "开始直播" }}
        </a-tooltip>
      </a-col>
      <a-col :span="2">
        <common-icon-font
          :style="{ cursor: 'pointer', position: 'relative', top: 15 }"
          type="icon-liuliang"
          :size="32"
          @click="handleClickStream"
        />
        <br />
        推流码
      </a-col>

      <a-col :span="2" v-if="!props.isWebLive">
        <icon-customer-service
          :style="{ cursor: 'pointer', position: 'relative', top: 15 }"
          :size="32"
          @click="handleWebLive(true)"
        />
        <br />
        网页推流
      </a-col>
      <a-col :span="2" v-else>
        <icon-desktop
          :style="{ cursor: 'pointer', position: 'relative', top: 15 }"
          :size="32"
          @click="handleWebLive(false)"
        />
        <br />
        观众视角
      </a-col>
    </a-row>
  </div>

  <a-modal
    v-model:visible="visible"
    title="推流码"
    @before-open="getSrsSecret"
    @cancel="closeModal"
    @ok="closeModal"
  >
    <a-form :model="rtmp" label-align="left" auto-label-width>
      <a-form-item field="name" label="推流地址">
        <a-input v-model="rtmp.url" disabled />
        <a-button type="primary" @click="handleCopyUrl">一键复制</a-button>
      </a-form-item>
      <a-form-item field="post" label="串流秘钥">
        <a-input v-model="rtmp.secret" disabled />
        <a-button type="primary" @click="handleCopySecret">一键复制</a-button>
      </a-form-item>
    </a-form>
    推流方法: 以 OBS 为例, 打开设置的推流选项,
    分别将<b>推流地址</b>和<b>串流秘钥</b>复制粘贴到 OBS
    的<b>服务器</b>和<b>串流秘钥</b>的输入框中, 保存设置之后开始推流。
    <br />
    <br />
    <b>建议每次开播都使用新的串流秘钥,以免泄露。</b>
  </a-modal>
</template>

<script setup lang="ts">
import { fetchSecret, startLiving, stopLiving } from "@/services/anchor";
import { Message } from "@arco-design/web-vue";
import { IconCustomerService, IconDesktop } from "@arco-design/web-vue/es/icon";
import { CommonIconFont } from "@/utils/iconfontAdapter";
import { reactive, ref } from "vue";
import moment from "moment";
import copy from "copy-to-clipboard";

const props = defineProps<{
  isLive: boolean;
  isWebLive: boolean;
}>();

const emit = defineEmits<{
  (e: "setLive", val: string | number | boolean): void;
  (e: "setLastLiveTime", val: string): void;
  (e: "setStreamKey", val: string): void;
  (e: "setWebLive", val: boolean): void;
  (e: "init"): void;
  (e: "destroy"): void;
}>();

// 推流相关
const rtmp = reactive({
  url: "", // 推流 rtmp 地址
  secret: "", // 用于显示的秘钥 **
  realSecret: "", // 真实的秘钥
});
const visible = ref(false);

// 开播开关事件
async function handleChangeIntercept(val: boolean) {
  if (val) {
    return await startLive();
  } else {
    return await stopLive();
  }
}

// 开播
async function startLive() {
  const success = await startLiving();
  if (success) {
    emit("setLastLiveTime", moment.utc().format());
    Message.success("已开播, 请复制推流码进行推流");
    return true;
  }

  return false;
}

// 关播
async function stopLive() {
  const success = await stopLiving();
  if (success) {
    Message.warning("已关播, 请确认停止推流, 否则直播将继续");
    return true;
  }

  return false;
}

// 打开浮层
function handleClickStream() {
  if (props.isLive) {
    visible.value = true;
  } else {
    // 未开播不打开
    Message.warning("未开播不能进行推流");
  }
}

// 关闭浮层
function closeModal() {
  visible.value = false;
}

// 开启浮层前获取推流秘钥
async function getSrsSecret() {
  const data = await fetchSecret();
  rtmp.url = data.url;
  rtmp.secret = `${data.key}?secret=************************`;
  rtmp.realSecret = `${data.key}?secret=${data.secret}`;

  emit("setStreamKey", data.key);
}

// 复制服务器地址
function handleCopyUrl() {
  let success = copy(rtmp.url);
  if (success) {
    Message.success("已复制到剪贴板");
  } else {
    Message.error("请重试");
  }
}

// 复制串流秘钥
function handleCopySecret() {
  let success = copy(rtmp.realSecret);
  if (success) {
    Message.success("已复制到剪贴板");
  } else {
    Message.error("请重试");
  }
}

// 网页直播
function handleWebLive(status: boolean) {
  if (props.isLive) {
    emit("setWebLive", status);
  } else {
    Message.warning("未开播不能进行网页直播");
  }
}
</script>

<style scoped lang="less">
@import "@/index.less";

.room-anchor-channel {
  height: 100px;
  width: 100%;
  border-radius: @custom_border-radius;
  border: @custom_border;
  margin-bottom: 10px;
  background-color: @custom_background-color;

  .grid-row {
    .arco-col {
      height: 100px;
      line-height: 48px;
      text-align: center;

      &:not(:first-child) {
        border-left: 1px solid #e2e4e0;
      }
    }
  }
}
</style>
