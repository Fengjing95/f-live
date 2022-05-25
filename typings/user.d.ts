/*
 * @Date: 2022-05-17 20:30:33
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-05-23 15:59:09
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
