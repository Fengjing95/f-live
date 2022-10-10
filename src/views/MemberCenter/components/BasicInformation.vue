<!--
 * @Date: 2022-10-10 20:41:19
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 用户基本信息修改表单
 * @LastEditTime: 2022-10-10 22:43:51
-->
<template>
  <a-form
    :model="formData"
    :label-col-props="{ span: 4 }"
    :wrapper-col-props="{ span: 20 }"
    class="form"
    ref="formRef"
    @submit-success="updateInfo"
  >
    <a-form-item
      field="nickname"
      label="昵称"
      :rules="[
        {
          required: true,
          message: '请输入昵称',
        },
      ]"
    >
      <a-input placeholder="请输入昵称" v-model="formData.nickname" />
    </a-form-item>
    <a-form-item
      field="description"
      label="个人简介"
      :rules="[
        {
          maxLength: 50,
          message: '不能超过 50 字',
        },
      ]"
    >
      <a-textarea placeholder="请输入个人简介" v-model="formData.description" />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button html-type="submit" type="primary">提交</a-button>
        <a-button @click="reset">重置</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { submitUserInfo } from "@/services/user";
import { useUserStore } from "@/stores/user";
import type { FormInstance } from "@arco-design/web-vue/es/form";
import { reactive, ref } from "vue";

const user = useUserStore();

const formData = reactive({
  nickname: user.info.nickname,
  description: user.info.description,
});

const formRef = ref<FormInstance>();

// 更新用户基本信息
async function updateInfo(values: Record<string, string>) {
  const newInfo = await submitUserInfo(values);
  Object.assign(user.info, newInfo);
}

// 重置
async function reset() {
  await formRef.value?.resetFields();
}
</script>

<style scoped>
.form {
  width: 540px;
  margin: 0 auto;
}
</style>
