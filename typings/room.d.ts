/*
 * @Date: 2022-06-08 11:08:59
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-09-10 22:31:29
 */
import type { UserInfoDTO } from "./user";

export interface MessageDTO {
  roomId: string;
  fromUsername: string;
  fromNickname: string;
  msg: string;
  id: string;
}

export interface Room {
  info: RoomInfoDTO;
  isLike: boolean;
  msgList: MessageDTO[];
  personCount: number;
}

export interface RoomInfoDTO {
  roomId: number;
  beautifulId: string;
  title: string;
  isLiving: boolean;
  streamKey: string;
  image: string;
  classification: Classification;
  lastLiveTime: string;
  createTime: string;
  fans: number;
  anchor: UserInfoDTO;
}
