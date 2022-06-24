/*
 * @Date: 2022-06-08 11:08:59
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-21 20:10:09
 */
import type { UserInfoDTO } from "./user";

export interface RoomInfoDTO {
  roomId: number;
  beautifulId: string;
  title: string;
  isLiving: boolean;
  streamKey: string;
  image: string;
  classification: string;
  lastLiveTime: string;
  createTime: string;
  fans: number;
  anchor: UserInfoDTO;
}

export interface MessageDTO {
  roomId: string;
  fromUsername: string;
  fromNickname: string;
  msg: string;
  id: string;
}
