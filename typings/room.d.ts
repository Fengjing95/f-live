/*
 * @Date: 2022-06-08 11:08:59
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-10-25 09:27:54
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

export interface SourceMaterialDTO {
  key: string;
  visible: boolean;
  text?: string;
  image?: string;
  style: {
    color: string;
    fontSize: string;
  };
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}
