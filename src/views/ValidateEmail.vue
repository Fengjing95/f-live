<!--
 * @Date: 2022-10-13 19:31:38
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 邮箱验证
 * @LastEditTime: 2022-10-13 20:20:36
-->
<template>
  <div class="validate-result">
    <a-result :status="iconStatus" title="邮箱验证">
      <template #icon>
        <icon-loading v-if="status === 'loading'" />
        <icon-check v-else-if="status === 'true'" />
        <icon-close v-else />
      </template>
      <template #subtitle>
        {{
          status === "loading"
            ? "正在验证"
            : status === "false"
            ? "验证失败"
            : "验证成功"
        }}
      </template>
      <template #extra>
        <a-space>
          <a-button type="primary" @click="router.push('/')">返回首页</a-button>
        </a-space>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts">
import { validateEmail } from "@/services/user";
import { Message } from "@arco-design/web-vue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  IconLoading,
  IconCheck,
  IconClose,
} from "@arco-design/web-vue/es/icon";
import { useUserStore } from "@/stores/user";

const props = defineProps<{ code: string }>();

// 当前状态
const status = ref("loading");
const router = useRouter();
const user = useUserStore();

// 图标状态
const iconStatus = computed(() => {
  const map: Record<string, "info" | "success" | "error"> = {
    loading: "info",
    true: "success",
    false: "error",
  };

  return map[status.value];
});

onMounted(async () => {
  status.value = String(await validateEmail(props.code));
  if (status.value === "true") {
    Message.success("验证成功");
    user.info.isValid = true;
  } else {
    Message.error("无效的校验码");
  }
});
</script>

<style scoped lang="less">
.validate-result {
  background-color: #fff;
}
</style>
