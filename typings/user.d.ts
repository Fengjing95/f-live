/*
 * @Date: 2022-05-17 20:30:33
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-06 11:14:16
 */
export interface LoginDTO {
  username: string;
  password: string;
}

export interface UserRegisterDTO {
  username: string;
  nickname: string;
  phone: string;
  code: string;
  password: string;
}

export interface UserInfoDTO {
  userId: string;
  nickname: string;
  username: string;
  avatar: string;
  description: string;
  role: number; // 0 普通用户 1 主播 2 超管
  createTime: string;
  updateTime: string;
  updateCount: number;
  freeze: number;
}
