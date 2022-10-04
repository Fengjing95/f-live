<!--
 * @Date: 2022-09-25 20:42:21
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 消息通知子路由组件
 * @LastEditTime: 2022-10-04 21:19:05
-->
<template>
  <div>
    <a-tabs type="card-gutter" @change="changeHandler">
      <a-tab-pane key="new" title="未读消息">
        <template v-if="notice.notReadNumber">
          <div :style="{ padding: '0 10px' }">
            <div :style="{ textAlign: 'right' }">
              <a-button type="outline" @click="read">全部已读</a-button>
            </div>
            <notice-item
              v-for="n in notice.newNotice"
              :key="n.messageId"
              :notice="n"
              @click="readById(n.messageId)"
            />
          </div>
        </template>
        <a-empty v-else description="暂无消息" />
      </a-tab-pane>

      <a-tab-pane key="old" title="历史消息">
        <template v-if="notice.readNoticeNumber">
          <div :style="{ padding: '0 10px' }">
            <notice-item
              v-for="n in notice.notice"
              :key="n.messageId"
              :notice="n"
            />
          </div>
          <div :style="{ padding: '0 0 20px 0' }">
            <a-pagination
              :total="notice.total"
              :page-size="100"
              @change="pageChangeHandler"
            />
          </div>
        </template>
        <a-empty v-else description="暂无消息" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { readAllNotice, readNotice } from "@/services/member";
import { useNoticeStore } from "@/stores/notice";
import { inject, type Ref } from "vue";
import NoticeItem from "./components/NoticeItem.vue";

// 消息中心
const notice = useNoticeStore();

// sharedWorker
const port = inject<Ref<MessagePort>>("noticeWorker");

// 清空未读消息
async function read() {
  const success = await readAllNotice();
  if (success) {
    port?.value.postMessage({ event: "readAll" });
  }
}

async function readById(id: number) {
  const success = await readNotice(id);
  if (success) {
    port?.value.postMessage({ event: "read", payload: id });
  }
}

function changeHandler(event: string | number) {
  if (event === "old") {
    notice.getOldNotice();
  }
}

function pageChangeHandler(cur: number) {
  notice.setPage(cur);
  notice.getOldNotice();
}
</script>

<style scoped></style>
