<!--
 * @Date: 2022-09-17 18:57:13
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 动态编辑器(引用 wangEditor)
 * @LastEditTime: 2022-09-18 21:27:09
-->
<template>
  <div class="editor">
    <div class="editor-title">
      <a-avatar>
        <img :src="user.info.avatar" />
      </a-avatar>
      <div style="margin: 0 10px; flex: 1">
        <a-input
          placeholder="请在此输入标题"
          v-model="title"
          size="large"
          :max-length="20"
        />
      </div>

      <a-button @click="handleSubmit" type="primary" size="large"
        >发布</a-button
      >
    </div>
    <div class="editor-container">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 250px; overflow-y: hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import type {
  IToolbarConfig,
  IDomEditor,
  IEditorConfig,
} from "@wangeditor/editor";
import { useUserStore } from "@/stores/user";
import { Message } from "@arco-design/web-vue";

const user = useUserStore();

const emit = defineEmits<{
  (
    event: "submit",
    title: string,
    html: string,
    text: string,
    imageList: string[],
    cb?: (res: boolean) => void
  ): boolean;
}>();

const imageList = ref<string[]>([]); // imageList
const title = ref<string>(""); // 标题

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  // 要移除的功能
  excludeKeys: [
    "insertVideo",
    "insertTable",
    "codeBlock",
    "undo",
    "redo",
    "fullScreen",
    "justifyLeft",
    "justifyRight",
    "justifyCenter",
    "insertImage",
  ],
};

type InsertFnType = (url: string, alt: string, href: string) => void;

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  // 菜单配置
  MENU_CONF: {
    // 修改上传图片配置
    uploadImage: {
      maxNumberOfFiles: 1,
      server: "/api/file/image",
      fieldName: "file",
      headers: {
        Authorization: user.getToken,
      },
      // 自定义插入图片
      customInsert(
        res: { success: boolean; data: string; code: number },
        insertFn: InsertFnType
      ) {
        // res 即服务端的返回结果
        const url = "https://" + res.data;
        // 从 res 中找到 url alt href ，然后插入图片
        insertFn(url, "", "");
        // 保存 imageList(最多保留三张)
        if (imageList.value.length < 3) {
          imageList.value.push(url);
        }
      },
    },
  },
};

// 模式
const mode = "simple";

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>();

// 内容 HTML
const valueHtml = ref("");

// 传递 editor 实例
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

// 重置
function reset() {
  valueHtml.value = "";
  title.value = "";
  imageList.value = [];
}

// 传递出动态数据
function handleSubmit() {
  const text = editorRef.value?.getText() || "";
  if (!title.value) {
    // 没有标题
    Message.warning("请输入标题");
    return;
  }

  if (!valueHtml.value || valueHtml.value === "<p><br></p>") {
    // 没有内容
    Message.warning("不能提交空内容");
    return;
  }
  emit("submit", title.value, valueHtml.value, text, imageList.value, (res) => {
    if (res) {
      reset();
    }
  });
}
</script>

<style scoped lang="less">
.editor {
  padding: 0 40px;
  .editor-title {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  .editor-container {
    border: 1px solid #ccc;
    // border-radius: 8px;
  }
}
</style>
