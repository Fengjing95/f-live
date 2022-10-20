/*
 * @Date: 2022-09-25 21:48:02
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 个人中心接口层
 * @LastEditTime: 2022-10-04 13:12:34
 */

import { request } from "@/utils/request";
import type { NoticeDTO } from "#/notice";
import type { PaginationResponseData } from "#/util";

/*
 * notice 通知相关
 */

/**
 * 获取未读消息
 * @returns
 */
export async function getNewNotice(): Promise<NoticeDTO[]> {
  return request.get("/message/list");
}

/**
 * 获取读取的消息
 * @param page 页码
 * @returns
 */
export async function getOldNotice(
  page: number
): Promise<PaginationResponseData<NoticeDTO>> {
  return request.get(`/message/list/read?page=${page}`);
}

/**
 *  已读消息
 * @param id 消息 ID
 * @returns
 */
export async function readNotice(id: number): Promise<boolean> {
  return request.put(`/message/read/${id}`);
}

/**
 * 全部已读
 * @returns
 */
export async function readAllNotice(): Promise<boolean> {
  return request.put(`/message/read/all`);
}
