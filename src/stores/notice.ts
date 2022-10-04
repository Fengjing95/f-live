/*
 * @Date: 2022-09-25 21:24:05
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 消息通知 store
 * @LastEditTime: 2022-10-04 20:31:04
 */

import type { NoticeDTO } from "#/notice";
import { defineStore } from "pinia";
import { getNewNotice, getOldNotice } from "@/services/member";

export const useNoticeStore = defineStore({
  id: "notice",
  state: () => ({
    newNotice: [] as NoticeDTO[],
    notice: [] as NoticeDTO[],
    page: 1,
    loading: false,
    total: 0,
  }),
  actions: {
    // 从服务器获取未读消息
    async getNotice() {
      this.loading = true;
      this.newNotice = await getNewNotice();
      this.loading = false;
    },
    async getOldNotice() {
      this.loading = true;
      const notice = await getOldNotice(this.page);
      this.total = notice.total;
      this.notice = notice.content;
      this.loading = false;
    },
    // 插入新消息
    insertNoticeAtHead(notice: NoticeDTO) {
      this.newNotice.unshift(notice);
    },
    // 已读某条消息
    readNoticeById(id: number) {
      // const success = await readNotice(id);
      // if (success) {
      const idx = this.newNotice.findIndex((i) => i.messageId === id);
      this.newNotice.splice(idx, 1);
      // }
    },
    // 全部已读
    readAll() {
      // const success = await readAllNotice();
      // if (success)
      this.newNotice = [];
    },
    // 设置页码
    setPage(page: number) {
      this.page = page;
    },
  },
  getters: {
    // 未读消息数
    notReadNumber(): number {
      return this.newNotice.length;
    },
    // 已读消息数
    readNoticeNumber(): number {
      return this.notice.length;
    },
    isAllLoad(): boolean {
      return this.total === this.notice.length;
    },
  },
});
