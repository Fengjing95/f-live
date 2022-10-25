<!--
 * @Date: 2022-10-25 09:23:33
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-10-25 22:21:39
-->
<template>
  <div class="material_item">
    <icon-eye
      :size="16"
      v-if="material.visible"
      class="allow_icon"
      @click="visibleChange(false)"
    />
    <icon-eye-invisible
      :size="16"
      v-else
      class="allow_icon"
      @click="visibleChange(true)"
    />
    <div class="text_content">
      {{ props.material.text }}
    </div>
    <a-space>
      <icon-settings
        v-if="!material.image"
        class="allow_icon"
        @click="emit('edit')"
      />
      <icon-caret-up
        :class="isHead ? 'disable_icon' : 'allow_icon'"
        @click="emit('move', 'top')"
      />
      <icon-caret-down
        :class="isFoot ? 'disable_icon' : 'allow_icon'"
        @click="emit('move', 'down')"
      />
      <icon-delete class="allow_icon" @click="emit('delete')" />
    </a-space>
  </div>
</template>

<script setup lang="ts">
import type { SourceMaterialDTO } from "#/room";
import {
  IconEye,
  IconEyeInvisible,
  IconDelete,
  IconCaretUp,
  IconCaretDown,
  IconSettings,
} from "@arco-design/web-vue/es/icon";
import { reactive } from "vue";

const props = defineProps<{
  material: SourceMaterialDTO;
  isHead: boolean;
  isFoot: boolean;
}>();

const emit = defineEmits<{
  (e: "change", data: SourceMaterialDTO): void;
  (e: "move", direction: "top" | "down"): void;
  (e: "delete"): void;
  (e: "edit"): void;
}>();

function visibleChange(v: boolean) {
  const copyObj = reactive({ ...props.material });
  copyObj.visible = v;
  emit("change", copyObj);
}
</script>

<style scoped lang="less">
.material_item {
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 6px;
  }

  .text_content {
    margin: 0 5px;
    flex: 1;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .disable_icon {
    color: #ccc;
    cursor: not-allowed;
  }

  .allow_icon {
    cursor: pointer;
    &:hover {
      color: @primary-custom;
    }
  }
}
</style>
