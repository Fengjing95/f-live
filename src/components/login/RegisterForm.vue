<!--
 * @Date: 2022-05-17 19:54:06
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-10-14 19:27:48
-->
<template>
  <a-form
    :model="registerForm"
    @submit-success="register"
    :label-col-props="{ span: 2, offset: 0 }"
    :wrapper-col-props="{ span: 20 }"
  >
    <a-form-item
      hide-asterisk
      feedback
      field="username"
      :rules="[
        { required: true, message: '请输入用户名' },
        {
          match: /^[a-zA-Z0-9]{5,10}$/,
          message: '用户名由 5-10 位数字和字母组成',
        },
        {
          validator: userExistRule,
        },
      ]"
      :validate-trigger="['change']"
    >
      <a-input v-model="registerForm.username" placeholder="请输入用户名">
        <template #prefix>
          <icon-user />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      hide-asterisk
      feedback
      field="nickname"
      :rules="[
        { required: true, message: '请输入昵称' },
        { maxLength: 10, minLength: 2, message: '昵称长度在 2-10 之间' },
      ]"
    >
      <a-input v-model="registerForm.nickname" placeholder="请输入昵称">
        <template #prefix>
          <icon-user-group />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      hide-asterisk
      feedback
      field="phone"
      :rules="[
        { required: true, message: '请输入手机号' },
        {
          validator: phoneValidate,
        },
      ]"
      :validate-trigger="['input', 'change']"
    >
      <a-input v-model="registerForm.phone" placeholder="请输入手机号">
        <template #prefix> <icon-mobile /> +86 </template>
      </a-input>
    </a-form-item>

    <a-form-item
      hide-asterisk
      field="code"
      :rules="[{ required: true, message: '请输入验证码' }]"
    >
      <a-input placeholder="请输入短信验证码" v-model="registerForm.code">
        <template #prefix> <icon-message /></template>
        <template #append>
          <div
            @click="sendCodeMessage"
            :class="time || sendDisabled ? 'send-not-allow' : 'send-allow'"
          >
            {{ send }}
          </div>
        </template>
      </a-input>
    </a-form-item>

    <a-form-item
      hide-asterisk
      feedback
      field="password"
      :rules="[
        { required: true, message: '请输入密码' },
        { maxLength: 16, minLength: 8, message: '密码长度在 8-16 位' },
      ]"
    >
      <a-input-password
        v-model="registerForm.password"
        placeholder="请输入密码"
      >
        <template #prefix> <icon-lock /> </template>
      </a-input-password>
    </a-form-item>

    <a-form-item
      hide-asterisk
      feedback
      field="rePassword"
      :rules="[
        { required: true, message: '请再次输入密码' },
        {
          validator: (value, cb) => {
            if (value !== registerForm.password) cb('两次密码不一致');
          },
        },
      ]"
      :validate-trigger="['input']"
    >
      <a-input-password
        v-model="registerForm.rePassword"
        placeholder="请确认密码"
      >
        <template #prefix> <icon-lock /> </template>
      </a-input-password>
    </a-form-item>
    <a-form-item>
      <a-button
        :loading="loading"
        long
        shape="round"
        type="primary"
        html-type="submit"
        >注册</a-button
      >
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  IconUser,
  IconLock,
  IconMobile,
  IconMessage,
  IconUserGroup,
} from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import {
  isUsernameExist,
  sendMessage,
  registerUser,
  getPublicKey,
} from "@/services/user";
import { useUserStore } from "@/stores/user";
import { useGlobalStore } from "@/stores/global";
import { encodeByPublicKey } from "@/utils/RSAEncode";
import { getHashWithString } from "@/utils/md5";

const loading = ref(false); // 注册按钮状态

const sendDisabled = ref(true); // 发送按钮状态

const send = ref("获取验证码"); // 短信发送按钮

const registerForm = reactive({
  username: "",
  nickname: "",
  phone: "",
  code: "",
  password: "",
  rePassword: "",
});

/**
 * @description: 手机号格式错误不发送验证码
 * @param {*} value
 * @param {*} cb
 * @return {*}
 */
function phoneValidate(value: string, cb: (s: string) => void) {
  return new Promise((resolve) => {
    if (
      !/^1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/.test(
        value
      )
    ) {
      cb("请输入合法手机号");
      sendDisabled.value = true;
    } else {
      sendDisabled.value = false;
    }
    resolve(true);
  });
}

/**
 * @description: 检测用户名是否存在
 * @param {*} value
 * @param {*} cb
 * @return {*}
 */
function userExistRule(value: string, cb: (s: string) => void) {
  return new Promise((resolve) => {
    isUsernameExist(value).then((res) => {
      if (res) cb("用户名已存在");
      resolve(true);
    });
  });
}

/**
 * @description: 注册
 * @param {*}
 * @return {*}
 */
function register(values: Record<string, string>) {
  loading.value = true;
  let { username, nickname, phone, code, password } = values;
  getPublicKey(username)
    .then((key) => {
      const encode = encodeByPublicKey(key, getHashWithString(password));
      return { username, nickname, phone, code, password: encode };
    })
    .then(registerUser)
    .then(async (token) => {
      if (token) {
        // 保存 token
        useUserStore().setToken(token);
        await useUserStore().getUserInfo();
        Message.success("注册成功");
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

let time = ref(0); // 倒计时
/**
 * @description: 发送短信验证码
 * @param {*}
 * @return {*}
 */
async function sendCodeMessage() {
  if (time.value > 0 || sendDisabled.value)
    // 如果已经存在计时或者手机号格式不正确不再发送
    return;
  const success = await sendMessage(registerForm.phone);
  if (success) {
    time.value = 60;
    Message.success("已发送");
    send.value = `重新获取(${time.value}s)`;
    time.value--;
    let timer = setInterval(() => {
      if (time.value === 0) {
        // 倒计时结束回复状态
        send.value = "获取验证码";
        clearInterval(timer);
      } else {
        // 否则刷新状态
        send.value = `重新获取(${time.value}s)`;
        time.value--;
      }
    }, 1000);
  }
}
</script>

<style scoped lang="less">
.send-allow {
  cursor: pointer;
  color: @primary-custom;
}

.send-not-allow {
  cursor: not-allowed;
}
</style>
