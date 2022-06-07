/*
 * @Date: 2022-06-06 16:16:19
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-06 16:28:19
 */

interface FavoriteItemDTO {
  content: Content[];
  total: number;
}

interface Content {
  followId: number;
  room: Room;
}

export interface Room {
  roomId: number;
  beautifulId: string;
  title: string;
  isLiving: boolean;
  streamKey: string;
  image: string;
  classification: string;
  lastLiveTime: string;
  createTime: string;
  anchor: Anchor;
}

interface Anchor {
  userId: string;
  nickname: string;
  username: string;
  avatar: string;
  description?: string;
  role: number;
  createTime: string;
  updateTime: string;
  updateCount: number;
  freeze: number;
}
