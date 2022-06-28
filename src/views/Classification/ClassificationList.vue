<!--
 * @Date: 2022-06-07 17:15:28
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-27 22:41:06
-->
<template>
  <!-- 分区筛选 -->
  <ul class="area-container">
    <li
      v-for="item in areaKey"
      :key="item"
      @click="selectAreaHandler(item)"
      :class="item === selectedArea ? 'active-area' : ''"
    >
      {{ areaMap[item] }}
    </li>
  </ul>

  <!-- 分类列表 -->
  <ul class="classification-container">
    <li
      v-for="item in filteredClasses"
      :key="item.classId"
      @click="router.push(`/classification/${item.classKey}`)"
    >
      <classification-item :classInfo="item" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Classification, SelectArea } from "#/class";
import { getClasses } from "@/services/class";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import ClassificationItem from "./components/ClassificationItem.vue";

const router = useRouter();

const classes = ref<Classification[]>([]); // 所有的分类

const selectedArea = ref<SelectArea>("all"); // 选择的分区, 默认全部

const areaMap = {
  all: "全部分类",
  isGame: "网游竞技",
  isRecreation: "娱乐天地",
};
const areaKey = Object.keys(areaMap).map(
  (item) => item as keyof typeof areaMap
); // 分区 key
const filteredClasses = computed(() =>
  classes.value.filter(
    (i) => i[selectedArea.value] || selectedArea.value === "all"
  )
); // 过滤之后的分类

// 选择分区
function selectAreaHandler(area: SelectArea) {
  selectedArea.value = area;
}

onMounted(async () => {
  classes.value = await getClasses();
});
</script>

<style scoped lang="less">
@import "@/index.less";
.area-container {
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  li {
    list-style: none;
    width: 100px;
    padding: 5px 10px;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    margin: 5px;
    height: 33px;
    border-radius: 15px;
    background-color: @custom_background-color;
    border: @custom_border;
    &:hover:not(.active-area) {
      border: solid 1px @primary-custom;
      color: @primary-custom;
    }
  }
  .active-area {
    background-color: @primary-custom;
    color: #fff;
  }
}

.classification-container {
  margin-top: 20px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  li {
    list-style: none;
    margin-bottom: 30px;
    padding: 0 18px;
    width: 12.5%;
  }
}
</style>
