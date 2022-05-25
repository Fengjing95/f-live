<!--
 * @Date: 2022-05-17 19:42:37
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-05-23 16:02:30
-->
<template>
  <a-form
    :model="loginForm"
    @submit="login"
    :label-col-props="{ span: 2, offset: 0 }"
    :wrapper-col-props="{ span: 20 }"
  >
    <a-form-item
      hide-asterisk
      field="username"
      :rules="[{ required: true, message: '请输入用户名/邮箱/手机号' }]"
    >
      <a-input
        v-model="loginForm.username"
        placeholder="请输入用户名/邮箱/手机号"
        ><template #prefix> <icon-user /> </template
      ></a-input>
    </a-form-item>
    <a-form-item
      hide-asterisk
      field="password"
      :rules="[{ required: true, message: '请输入密码' }]"
    >
      <a-input-password v-model="loginForm.password" placeholder="请输入密码"
        ><template #prefix> <icon-lock /> </template
      ></a-input-password>
    </a-form-item>
    <a-form-item>
      <a-button
        :loading="loading"
        long
        shape="round"
        type="primary"
        html-type="submit"
        >登录</a-button
      >
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { IconUser, IconLock } from "@arco-design/web-vue/es/icon";
import { getPublicKey, loginByPassword } from "@/services/user";
import { useGlobalStore } from "@/stores/global";
import { Message } from "@arco-design/web-vue";
import type { ValidatedError } from "@arco-design/web-vue";
import { useUserStore } from "@/stores/user";
import { encodeByPublicKey } from "@/utils/RSAEncode";

const loading = ref(false);
const loginForm = reactive({
  username: "",
  password: "",
});

/**
 * @description: 登录
 * @param {*}
 * @return {*}
 */
function login({
  values,
  errors,
}: {
  values: typeof loginForm;
  errors: undefined | Record<string, ValidatedError>;
}) {
  if (errors) return;
  loading.value = true;
  // 加密登录
  getPublicKey(values.username)
    .then((key) => {
      const password = encodeByPublicKey(key, values.password);
      return { username: values.username, password };
    })
    .then(loginByPassword)
    .then((token) => {
      if (token) {
        // 保存 token
        useUserStore().setToken(token);
        Message.success("登录成功");
        // 关闭登录框
        useGlobalStore().overLogin();
      }
    })
    .catch((err) => {
      Message.error(err.message);
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<style scoped></style>
