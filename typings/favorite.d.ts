/*
 * @Date: 2022-06-06 16:16:19
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-27 11:14:28
 */

export interface FavoriteItemDTO {
  content: Content[];
  total: number;
}

interface Content {
  followId: number;
  room: RoomDTO;
}

// interface Anchor {
//   userId: string;
//   nickname: string;
//   username: string;
//   avatar: string;
//   description?: string;
//   role: number;
//   createTime: string;
//   updateTime: string;
//   updateCount: number;
//   freeze: number;
// }
