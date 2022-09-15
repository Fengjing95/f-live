/*
 * @Date: 2022-09-07 21:27:45
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 根据地类型文件
 * @LastEditTime: 2022-09-14 21:27:57
 */
import { Author } from "./user";
import { RoomInfoDTO } from "./room";

export interface DynamicDTO {
  postId: number;
  title: string;
  imageList?: string[];
  contentText: string;
  createTime: string;
  updateTime: string;
  deleteTime?: string;
  author: Author;
  citadel?: Citadel;
  thumbsCount: number;
  reviewsCount: number;
  isThumb: 1 | 0;
}

interface Citadel {
  citadelId: number;
  name: string;
  description: string;
  photo: string;
}

export interface FollowDTO {
  citadelId: number;
  name: string;
  description: string;
  photo: string;
}

export interface CitadelInfoDTO {
  citadelId: number;
  name: string;
  description: string;
  photo: string;
  room: RoomInfoDTO;
}
