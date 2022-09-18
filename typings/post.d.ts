/*
 * @Date: 2022-09-18 20:35:37
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 文章类型
 * @LastEditTime: 2022-09-18 22:17:19
 */
import { UserInfoDTO } from "./user";
import { Citadel } from "./citadel";

export interface PostDetailDTO {
  postId: number;
  title: string;
  content: string;
  createTime: string;
  updateTime: string;
  deleteTime?: string;
  author: UserInfoDTO;
  citadel: Citadel;
  thumbs: number;
  isThumb: number;
}

export interface PostCreateDTO {
  title: string;
  content: string;
  contentText: string;
  imageList?: string[];
}
