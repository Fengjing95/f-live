<!--
 * @Date: 2022-10-13 20:28:11
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 修改邮箱表单
 * @LastEditTime: 2022-10-14 10:19:00
-->
<template>
  <a-modal
    title="邮箱绑定"
    :visible="props.visible"
    @ok="submit"
    @cancel="closeModal"
    :ok-loading="loading"
  >
    <a-form :model="formData" ref="formRef">
      <a-form-item
        field="email"
        label="邮箱"
        :validate-trigger="['input']"
        :rules="[
          {
            required: true,
            message: '请输入邮箱',
          },
          {
            type: 'email',
            message: '邮箱格式不合法',
          },
        ]"
      >
        <a-input v-model="formData.email" placeholder="请输入邮箱" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { updateEmail } from "@/services/user";
import { useUserStore } from "@/stores/user";
import { Message } from "@arco-design/web-vue";
import type { FormInstance } from "@arco-design/web-vue/es/form";
import { reactive, ref } from "vue";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible"): void;
}>();

const formRef = ref<FormInstance>();

const user = useUserStore();

const formData = reactive({
  email: user.info.email,
});

const loading = ref(false);

async function submit() {
  const errors = await formRef.value?.validate();
  if (errors) return;
  loading.value = true;
  const success = await updateEmail(formData.email as string);
  if (success) {
    Message.success("绑定成功, 请尽快前往验证");
    emit("update:visible");
    user.info.email = formData.email;
    user.info.isValid = false;
  }
  loading.value = false;
}

function closeModal() {
  emit("update:visible");
  formRef.value?.resetFields();
}
</script>

<style scoped></style>
