<!--
 * @Date: 2022-09-25 20:36:27
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 个人中心
 * @LastEditTime: 2022-10-10 16:35:48
-->
<template>
  <div class="member_container">
    <div class="menu-demo">
      <a-menu
        mode="pop"
        showCollapseButton
        :style="{ width: '220px', marginRight: '30px' }"
        :selected-keys="[route.meta.key]"
      >
        <a-menu-item
          v-for="r in route.matched[0].children"
          :key="r.meta?.key || r.path"
          @click="router.push(path + '/' + r.path)"
        >
          <template #icon><Component :is="r.meta?.icon" /></template>
          {{ r.meta?.name }}
        </a-menu-item>
      </a-menu>
    </div>

    <div class="member_content">
      <div class="member_title">
        <Component :is="route.meta.icon" />
        {{ route.meta.name }}
      </div>
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const path = ref(route.matched[0].path);
</script>

<style scoped lang="less">
.member_container {
  display: flex;

  .menu-demo {
    .arco-menu {
      width: 200px;
      /* height: 100%; */
      min-height: calc(100vh - 105px);
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
    }

    .arco-menu :deep(.arco-menu-collapse-button) {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }

    .arco-menu:not(.arco-menu-collapsed) :deep(.arco-menu-collapse-button) {
      right: 0;
      bottom: 8px;
      transform: translateX(50%);
    }

    .arco-menu:not(.arco-menu-collapsed)::before {
      content: "";
      position: absolute;
      right: 0;
      bottom: 0;
      width: 48px;
      height: 48px;
      background-color: inherit;
      border-radius: 50%;
      box-shadow: -4px 0 2px var(--color-bg-2), 0 0 1px rgba(0, 0, 0, 0.3);
      transform: translateX(50%);
    }

    .arco-menu.arco-menu-collapsed {
      width: 48px;
      /* height: auto; */
      min-height: calc(100vh - 105px);
      padding-top: 24px;
      padding-bottom: 138px;
      border-radius: 22px;
    }

    .arco-menu.arco-menu-collapsed :deep(.arco-menu-collapse-button) {
      right: 8px;
      bottom: 8px;
    }
  }
  .member_content {
    flex: 1;
    padding: 16px;
    background-color: #fff;

    .member_title {
      background: #f5f5f5;
      font-size: 16px;
      padding: 10px 14px;
      line-height: 28px;
      margin-bottom: 20px;
    }
  }
}
</style>
