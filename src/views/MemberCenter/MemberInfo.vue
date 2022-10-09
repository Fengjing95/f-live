<!--
 * @Date: 2022-10-08 20:44:52
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 用户信息
 * @LastEditTime: 2022-10-08 21:29:26
-->
<template>
  <div class="container">
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <user-panel />
      </a-col>
    </a-row>
    <a-row class="wrapper">
      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" title="基本信息">
            <BasicInformation />
          </a-tab-pane>
          <a-tab-pane key="2" title="实名认证">
            <SecuritySettings />
          </a-tab-pane>
          <a-tab-pane key="3" title="安全设置">
            <Certification />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import UserPanel from "./components/UserPanel.vue";
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.wrapper {
  padding: 20px 0 0 20px;
  min-height: 580px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
}

:deep(.section-title) {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
