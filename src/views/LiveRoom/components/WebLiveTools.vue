<!--
 * @Date: 2022-10-21 16:58:40
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 网页开播工具栏
 * @LastEditTime: 2022-10-29 17:06:41
-->
<template>
  <a-row class="grid-row">
    <a-col :span="2">
      <div
        class="tool-item"
        :class="props.isOpenScreen ? 'active' : ''"
        @click="handleScreen"
      >
        <common-icon-font
          type="icon-pingmugongxiang"
          :size="32"
          :style="{ position: 'relative', top: 13 }"
        />
        <br />
        屏幕共享
      </div>
    </a-col>

    <a-col :span="2">
      <div
        class="tool-item"
        :class="props.isOpenCamera ? 'active' : ''"
        @click="handleCamera"
      >
        <common-icon-font
          type="icon-luxiangji"
          :size="32"
          :style="{ position: 'relative', top: 13 }"
        />
        <br />
        摄像头
      </div>
    </a-col>

    <a-col :span="2">
      <div class="tool-item" @click="sourceMaterialVisible = true">
        <icon-folder :size="32" :style="{ position: 'relative', top: 13 }" />
        <br />
        素材管理
      </div>
    </a-col>

    <a-col :span="2">
      <div class="tool-item" @click="addVisible = true">
        <icon-folder-add
          :size="32"
          :style="{ position: 'relative', top: 13 }"
        />
        <br />
        添加素材
      </div>
    </a-col>

    <a-col :span="4" :offset="12">
      <a-button
        :style="{ marginTop: '25px' }"
        @click="handlePush"
        type="primary"
        shape="round"
        v-if="!isPushing"
      >
        开始推流
      </a-button>
      <a-popconfirm content="确定要停止推流?" @ok="handleStopPush" v-else>
        <a-button shape="round" :style="{ marginTop: '25px' }">
          停止推流
        </a-button>
      </a-popconfirm>
    </a-col>
  </a-row>

  <!-- 素材管理 modal -->
  <a-modal
    v-model:visible="sourceMaterialVisible"
    :footer="false"
    title="素材管理"
  >
    <template v-for="(item, index) in sourceMaterial" :key="item.key">
      <source-material-item
        :material="item"
        :isHead="index === 0"
        :isFoot="index === sourceMaterial.length - 1"
        @move="moveMaterial($event, index)"
        @change="changeMaterial($event, index)"
        @delete="deleteMaterial(index)"
        @edit="editMaterial(index)"
      />
    </template>
  </a-modal>

  <!-- 添加素材 modal -->
  <a-modal v-model:visible="addVisible" :footer="false" title="添加素材">
    <a-space size="large">
      <div
        class="add_material"
        @click="
          () => {
            addVisible = false;
            editMaterialVisible = true;
          }
        "
      >
        <icon-file :size="36" />
        文本素材
      </div>
      <a-upload
        :custom-request="selectImageMaterial"
        accept="image/png, image/jpg, image/jpeg, image/webp"
        :show-upload-button="true"
        :show-file-list="false"
      >
        <template #upload-button>
          <div class="add_material">
            <icon-file-image :size="36" />
            图片素材
          </div>
        </template>
      </a-upload>
    </a-space>
  </a-modal>

  <!-- 文本素材 modal -->
  <a-modal
    v-model:visible="editMaterialVisible"
    title="文本素材"
    @ok="saveMaterial"
    :body-style="{
      position: 'static',
    }"
  >
    <a-form-item label="颜色">
      <pick-colors
        v-model:value="targetMaterial.material.style.color"
        show-alpha
        :size="30"
      />
    </a-form-item>

    <a-form-item label="字号">
      <a-input-number
        :style="{ width: '100px' }"
        v-model="targetMaterial.material.rect.height"
        placeholder="请输入字体大小"
        hide-button
        :max="150"
        :min="16"
      >
        <template #append> px </template>
      </a-input-number>
    </a-form-item>

    <a-form-item label="文本">
      <a-input
        v-model="targetMaterial.material.text"
        placeholder="请输入要显示的文本"
      />
    </a-form-item>
  </a-modal>
</template>

<script setup lang="ts">
import type { SourceMaterialDTO } from "#/room";
import { CommonIconFont } from "@/utils/iconfontAdapter";
import {
  IconFolder,
  IconFolderAdd,
  IconFile,
  IconFileImage,
} from "@arco-design/web-vue/es/icon";
import { reactive, ref, watch } from "vue";
import SourceMaterialItem from "./SourceMaterialItem.vue";
import PickColors from "vue-pick-colors";
import { Message, type RequestOption } from "@arco-design/web-vue";
import { getDOMWidthWithFontSize, getImageSizeBySrc } from "@/utils/dom";
import { deepCloneByJSON } from "@/utils/common";
import { getTimeString } from "@/utils/time";

const props = defineProps<{
  isOpenScreen: boolean;
  isOpenCamera: boolean;
  sourceMaterial: SourceMaterialDTO[];
  isPushing: boolean;
}>();

const emit = defineEmits<{
  (e: "getCamera"): void;
  (e: "getScreen"): void;
  (e: "pushStream"): void;
  (e: "cancelCamera"): void;
  (e: "cancelScreen"): void;
  (e: "stopPushStream"): void;
  (e: "update:sourceMaterial", newValue: SourceMaterialDTO[]): void;
}>();

function handleCamera() {
  if (props.isOpenCamera) emit("cancelCamera");
  else emit("getCamera");
}

function handleScreen() {
  if (props.isOpenScreen) emit("cancelScreen");
  else emit("getScreen");
}

function handlePush() {
  emit("pushStream");
}

function handleStopPush() {
  emit("stopPushStream");
}

const sourceMaterialVisible = ref(false); // 素材管理可见

// 移动素材顺序
function moveMaterial(direction: "top" | "down", index: number) {
  const copy = [...props.sourceMaterial];
  // 首位不能上移
  if (direction == "top" && index === 0) {
    return;
  }

  if (direction == "down") {
    // 末位不能下移
    if (index === copy.length - 1) return;
    // index后移一位相当于向上替换
    index++;
  }

  const m = copy[index - 1];
  copy[index - 1] = copy[index];
  copy[index] = m;
  emit("update:sourceMaterial", copy);
}

// 删除素材
function deleteMaterial(index: number) {
  const copy = [...props.sourceMaterial];
  copy.splice(index, 1);
  emit("update:sourceMaterial", copy);
}

// 更新素材
function changeMaterial(data: SourceMaterialDTO, index: number) {
  const copy = [...props.sourceMaterial];
  copy[index] = data;
  emit("update:sourceMaterial", copy);
}

const initMaterial: SourceMaterialDTO = {
  key: "",
  text: "",
  visible: true,
  rect: {
    width: 16,
    height: 16,
    left: 0,
    top: 0,
  },
  style: {
    color: "#000000",
    fontSize: "16px",
  },
};
const editMaterialVisible = ref(false); // 编辑素材 modal 可见性
let targetMaterial = reactive({
  material: initMaterial,
  index: -1,
});
// 素材管理中编辑素材
function editMaterial(index: number) {
  targetMaterial.material = deepCloneByJSON(props.sourceMaterial[index]);
  targetMaterial.index = index;
  editMaterialVisible.value = true;
}

const addVisible = ref(false); // 添加素材可见性

// 选择图片素材
function selectImageMaterial(options: RequestOption) {
  const {
    fileItem: { url, name },
  } = options;
  getImageSizeBySrc(url as string).then(({ width, height }) => {
    const imageMaterial = {
      key: getTimeString(),
      visible: true,
      image: {
        name: name || "image",
        url: url as string,
      },
      rect: {
        width,
        height,
        left: 0,
        top: 0,
      },
      style: {},
    };

    const idx = props.sourceMaterial.length;

    changeMaterial(imageMaterial, idx);

    addVisible.value = false;
  });

  return {};
}

// 重置状态
function resetMaterial() {
  targetMaterial.material = {
    key: "",
    text: "",
    visible: true,
    rect: {
      width: 16,
      height: 16,
      left: 0,
      top: 0,
    },
    style: {
      color: "#000000",
      fontSize: "16px",
    },
  };
  targetMaterial.index = -1;
}

// 保存素材
function saveMaterial() {
  // index === -1 说明是新增
  let idx =
    targetMaterial.index === -1
      ? props.sourceMaterial.length
      : targetMaterial.index;
  // if (targetMaterial.index === -1)
  // 重新加 key, 否则在锁定比例的情况下无法重新赋值宽度
  targetMaterial.material.key = getTimeString();

  if (targetMaterial.material.text?.length) {
    // 绑定字号和和高度
    const height = targetMaterial.material.rect.height; // 高度即为字号
    targetMaterial.material.style.fontSize = height + "px";
    // 计算宽度
    const width = getDOMWidthWithFontSize(targetMaterial.material.text, height);
    targetMaterial.material.rect.width = width;
    changeMaterial(targetMaterial.material, idx);
    // editMaterialVisible.value = false;
  } else {
    Message.warning("文本内容不能为空");
  }
}

// 关闭 modal 重置对象
watch(editMaterialVisible, () => {
  !editMaterialVisible.value && resetMaterial();
});
</script>

<style scoped lang="less">
.grid-row {
  .arco-col {
    height: 92px;
    line-height: 40px;
    text-align: center;

    // &:not(:first-child) {
    //   border-left: 1px solid #e2e4e0;
    // }
  }

  .tool-item {
    cursor: pointer;

    &:hover {
      color: @primary-custom;
    }
  }
  .active {
    color: @primary-custom;
  }
}
.add_material {
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 5px;
  background-color: #fafafa;
  border: solid 1px #d4d2d2;
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  &:hover {
    color: @primary-custom;
  }
}
</style>
