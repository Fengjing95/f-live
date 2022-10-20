<!--
 * @Date: 2022-10-12 17:38:51
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-10-14 09:55:33
-->
<template>
  <a-list :bordered="false">
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph> 登录密码 </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              已设置。密码至少6位字符，支持数字、字母和除空格外的特殊字符，且必须同时包含数字和大小写字母。
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link @click="passwordVisible = true"> 修改 </a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>

    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph> 安全手机 </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              {{
                user.getPhoneAndHiddenPart
                  ? `已设置 ${user.getPhoneAndHiddenPart}`
                  : "未设置"
              }}
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link @click="phoneVisible = true">
              {{ user.getPhoneAndHiddenPart ? "修改" : "设置" }}
            </a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>

    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph> 安全邮箱 </a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph v-if="user.info.email">
              已设置
              <span v-if="user.info.isValid" class="tip"> 已验证 </span>
              <a-link v-else @click="validateEmail">点击验证</a-link>
            </a-typography-paragraph>
            <a-typography-paragraph v-else class="tip">
              您暂未设置邮箱，绑定邮箱可以用来找回密码、接收通知等。
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-link @click="emailVisible = true">
              {{ user.info.email ? "修改" : "设置" }}
            </a-link>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
  </a-list>

  <email-form v-model:visible="emailVisible" />
  <password-form v-model:visible="passwordVisible" />
  <phone-form v-model:visible="phoneVisible" />
</template>

<script lang="ts" setup>
import { sendEmail } from "@/services/user";
import { useUserStore } from "@/stores/user";
import { Message } from "@arco-design/web-vue";
import { ref } from "vue";
import EmailForm from "./forms/EmailForm.vue";
import PasswordForm from "./forms/PasswordForm.vue";
import PhoneForm from "./forms/PhoneForm.vue";

const user = useUserStore();

const emailVisible = ref(false);
const passwordVisible = ref(false);
const phoneVisible = ref(false);

async function validateEmail() {
  const success = await sendEmail();
  if (success) {
    Message.success("已发送, 请尽快前往验证");
  }
}
</script>

<style scoped lang="less">
:deep(.arco-list-item) {
  border-bottom: none !important;
  .arco-typography {
    margin-bottom: 20px;
  }
  .arco-list-item-meta-avatar {
    margin-bottom: 1px;
  }
  .arco-list-item-meta {
    padding: 0;
  }
}
:deep(.arco-list-item-meta-content) {
  flex: 1;
  border-bottom: 1px solid var(--color-neutral-3);

  .arco-list-item-meta-description {
    display: flex;
    flex-flow: row;
    justify-content: space-between;

    .tip {
      color: rgb(var(--gray-6));
    }
    .operation {
      margin-right: 6px;
    }
  }
}
</style>
