/*
 * @Date: 2022-09-18 20:35:37
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 文章类型
 * @LastEditTime: 2022-09-19 20:16:44
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

export interface ReviewDTO {
  reviewId: number;
  content: string;
  createTime: string;
  deleteTime?: string;
  fromUser: UserInfoDTO;
  parentReview?: ReviewDTO;
}
