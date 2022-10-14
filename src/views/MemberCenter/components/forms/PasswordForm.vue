<!--
 * @Date: 2022-10-13 20:28:01
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 修改密码表单
 * @LastEditTime: 2022-10-14 10:19:08
-->
<template>
  <a-modal
    title="修改密码"
    :visible="props.visible"
    @ok="submit"
    @cancel="closeModal"
    :ok-loading="loading"
  >
    <a-form :model="formData" ref="formRef">
      <a-form-item
        field="oldPassword"
        label="原密码"
        :validate-trigger="['input']"
        :rules="[
          {
            required: true,
            message: '请输入原密码',
          },
        ]"
      >
        <a-input-password
          v-model="formData.oldPassword"
          placeholder="请输入原密码"
        />
      </a-form-item>

      <a-form-item
        field="password"
        label="新密码"
        :validate-trigger="['input']"
        :rules="[
          {
            required: true,
            message: '请输入原密码',
          },
          { maxLength: 16, minLength: 8, message: '密码长度在 8-16 位' },
        ]"
      >
        <a-input-password
          v-model="formData.password"
          placeholder="请输入新密码"
        />
      </a-form-item>

      <a-form-item
        field="rePassword"
        label="确认新密码"
        :validate-trigger="['input']"
        :rules="[
          {
            required: true,
            message: '请确认密码',
          },
          {
            validator: (value, cb) => {
              if (value !== formData.password) cb('两次密码不一致');
            },
          },
        ]"
      >
        <a-input-password
          v-model="formData.rePassword"
          placeholder="请确认密码"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { getPublicKey, updatePassword } from "@/services/user";
import { useUserStore } from "@/stores/user";
import { getHashWithString } from "@/utils/md5";
import { encodeByPublicKey } from "@/utils/RSAEncode";
import { Message } from "@arco-design/web-vue";
import type { FormInstance } from "@arco-design/web-vue/es/form";
import { reactive, ref } from "vue";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible"): void;
}>();

const loading = ref(false);

const formRef = ref<FormInstance>();

const user = useUserStore();

const formData = reactive({
  oldPassword: "",
  password: "",
  rePassword: "",
});

async function submit() {
  const errors = await formRef.value?.validate();
  if (errors) return;
  loading.value = true;
  const success = await getPublicKey(user.info.username)
    .then((key) => {
      const password = encodeByPublicKey(
        key,
        getHashWithString(formData.password)
      );

      return {
        username: user.info.username,
        oldPassword: getHashWithString(formData.oldPassword),
        password,
      };
    })
    .then(updatePassword);

  if (success) {
    Message.success("修改成功");
    emit("update:visible");
    formRef.value?.resetFields();
  }
  loading.value = false;
}

function closeModal() {
  emit("update:visible");
  formRef.value?.resetFields();
}
</script>

<style scoped></style>
