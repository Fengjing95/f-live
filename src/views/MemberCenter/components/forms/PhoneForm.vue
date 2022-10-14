<!--
 * @Date: 2022-10-13 20:28:24
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 绑定手机号表单
 * @LastEditTime: 2022-10-14 10:36:46
-->
<template>
  <a-modal
    title="手机绑定"
    :visible="props.visible"
    @ok="submit"
    @cancel="closeModal"
    :ok-loading="loading"
  >
    <a-form :model="formData" ref="formRef">
      <a-form-item
        field="oldPhone"
        label="原手机号"
        :validate-trigger="['blur']"
        :rules="[
          {
            required: true,
            message: '请输入原手机号',
          },
          {
            validator: (value, cb) => {
              if (value !== user.info.phone) cb('原手机号错误');
            },
          },
        ]"
      >
        <a-input v-model="formData.oldPhone" placeholder="请输入原手机号" />
      </a-form-item>

      <a-form-item
        label="新手机号"
        field="newPhone"
        :rules="[
          { required: true, message: '请输入新手机号' },
          {
            validator: phoneValidate,
          },
        ]"
        :validate-trigger="['input', 'change']"
      >
        <a-input v-model="formData.newPhone" placeholder="请输入新手机号">
        </a-input>
      </a-form-item>

      <a-form-item
        label="验证码"
        field="code"
        :rules="[{ required: true, message: '请输入验证码' }]"
      >
        <a-input placeholder="请输入短信验证码" v-model="formData.code">
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
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { sendMessage, updatePhone } from "@/services/user";
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
  oldPhone: "",
  newPhone: "",
  code: "",
});

const loading = ref(false);

async function submit() {
  const errors = await formRef.value?.validate();
  if (errors) return;
  loading.value = true;
  const success = await updatePhone(formData);
  if (success) {
    Message.success("绑定成功");
    user.info.phone = formData.newPhone;
    closeModal();
  }
  loading.value = false;
}

function closeModal() {
  emit("update:visible");
  formRef.value?.resetFields();
}

const sendDisabled = ref(true); // 发送按钮状态
/**
 * @description: 手机号格式错误不发送验证码
 * @param {*} value
 * @param {*} cb
 * @return {*}
 */
function phoneValidate(value: string, cb: (s: string) => void) {
  return new Promise((resolve) => {
    // 同样的手机号
    if (value === user.info.phone) {
      cb("不可以重复绑定同一个手机号");
      sendDisabled.value = true;
    } else {
      // 手机号格式
      if (
        !/^1(?:3\d|4[5-79]|5[0-35-9]|6[5-7]|7[0-8]|8\d|9[189])\d{8}$/.test(
          value
        )
      ) {
        cb("请输入合法手机号");
        sendDisabled.value = true;
      } else {
        sendDisabled.value = false;
      }
    }

    resolve(true);
  });
}

const send = ref("获取验证码"); // 短信发送按钮

let time = ref(0); // 倒计时
/**
 * @description: 发送短信验证码
 * @param {*}
 * @return {*}
 */
function sendCodeMessage() {
  if (time.value > 0 || sendDisabled.value)
    // 如果已经存在计时或者手机号格式不正确不再发送
    return;
  time.value = 60;
  sendMessage(formData.newPhone)
    .then((code) => {
      // FIXME 不应该展示 code
      console.log(
        `%ccode%c${code}`,
        "background-color: #86de4f;color: #fff;padding: 3px 2px 3px 5px;border-radius: 5px 0 0 5px;",
        "background-color: #000000;color: #fff;padding: 3px 5px 3px 2px;border-radius: 0 5px 5px 0;"
      );
    })
    .then(() => {
      // 立即刷新一下状态
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
    });
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
