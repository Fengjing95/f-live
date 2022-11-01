<!--
 * @Date: 2022-06-27 16:59:44
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-11-01 20:54:29
-->
<template>
  <div class="citadel-container">
    <div class="citadel-sidebar">
      <ul>
        <li
          :class="{ active: route.name === 'citadelHome' }"
          @click="router.push('/citadel')"
        >
          全部动态
        </li>
        <li
          v-if="user.citadel.citadelId"
          :class="{
            active: Number(route.params?.citadelId) === user.citadel?.citadelId,
          }"
          @click="router.push(`/citadel/${user.citadel?.citadelId}`)"
        >
          我的根据地
        </li>
        <li
          v-for="f in data.follow"
          :key="f.citadelId"
          :class="{ active: Number(route.params?.citadelId) === f.citadelId }"
          @click="router.push(`/citadel/${f.citadelId}`)"
        >
          {{ f.name }}
        </li>
      </ul>
    </div>
    <div class="citadel-content">
      <!-- <RouterView v-slot="{ Component }">
        <Transition name="slide">
          <component :is="Component" />
        </Transition>
      </RouterView> -->
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FollowDTO } from "#/citadel";
import { getFollowCitadel } from "@/services/citadel";
import { useUserStore } from "@/stores/user";
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const route = useRoute();

const user = useUserStore();

const data = reactive<{ follow: FollowDTO[] }>({
  follow: [],
});
console.log(route);

onMounted(async () => {
  data.follow = await getFollowCitadel();
  if (user.isAnchor) {
    await user.getUserCitadelInfo();
  }
});
</script>

<style scoped lang="less">
@import "../../index.less";
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}
.slide-enter-from {
  position: absolute;
  left: 100%;
  opacity: 0;
}

.slide-enter-to {
  position: absolute;
  left: 0;
  opacity: 1;
}

.slide-leave-from {
  position: absolute;
  left: 100%;
  opacity: 1;
}
.slide-leave-to {
  position: absolute;
  left: 0;
  opacity: 0;
}

.citadel-container {
  margin-top: -20px;
  display: flex;

  .citadel-sidebar {
    width: 250px;
    // padding: 15px;
    // height: 100%;
    position: relative;

    ul {
      position: fixed;
      padding: 20px 0;
      width: 240px;
      height: calc(100vh - 62px);
      background-color: #fff;
      box-sizing: border-box;
      li {
        list-style-type: none;
        cursor: pointer;
        padding: 8px 30px;
        &:hover {
          background-color: @custom_primary-opacity;
          color: #fff;
        }
      }

      .active {
        color: @primary-custom;
      }
    }
  }

  .citadel-content {
    background-color: #fff;
    margin-left: 15px;
    flex: 1;
    // padding: 0 15px;
    position: relative;
    width: 0;
    overflow: hidden;
    // height: 200px;
  }
}
</style>
