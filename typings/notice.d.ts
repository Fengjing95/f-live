/*
 * @Date: 2022-09-25 21:29:46
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 通知类型
 * @LastEditTime: 2022-09-25 21:34:15
 */
import { UserInfoDTO } from "./user";
import { PostDetailDTO } from "./post";

export enum NoticeType {
  THUMB = "thumb",
  REVIEW = "review",
  REPLY = "reply",
  SYSTEM = "system",
}

export interface NoticeDTO {
  messageId: number;
  type: NoticeType;
  content: string;
  isRead: boolean;
  createTime: string;
  fromUser?: UserInfoDTO;
  toUser?: UserInfoDTO;
  target?: PostDetailDTO;
}
