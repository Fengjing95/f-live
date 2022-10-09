/*
 * @Date: 2022-05-15 10:13:12
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-10-09 20:55:22
 */

import type { LoginDTO, UserInfoDTO, UserRegisterDTO } from "#/user";
import { request } from "@/utils/request";

/**
 * @description: 刷新 token
 * @param {*}
 * @return {*}
 */
export async function refreshToken(): Promise<string> {
  return await request.get("/user/passport/refresh_token");
}

/**
 * @description: 获取公钥
 * @param {string} username 用户名
 * @return {*}
 */
export async function getPublicKey(username: string): Promise<string> {
  return await request.get(`/user/passport/getSecret?username=${username}`);
}

/**
 * @description: 登录
 * @param {LoginDTO} user 用户名/密码
 * @return {*}
 */
export async function loginByPassword(user: LoginDTO): Promise<string> {
  return await request.post("/user/passport/login", user);
}

/**
 * @description: 查询用户名是否被占用
 * @param {string} username 用户名
 * @return {*}
 */
export async function isUsernameExist(
  username: string
): Promise<"false" | "true"> {
  return await request.get(`/user/passport/hasUser?username=${username}`);
}

/**
 * @description: 向指定手机号发送短信验证码
 * @param {string} phone 亚发送验证码的手机号
 * @return {*}
 */
export async function sendMessage(phone: string): Promise<string> {
  // FIXME 这里为了节省成本直接将 code 作为响应返回,
  // 正规流程应该由 server 调用SDK 像手机号发送验证码短信
  return await request.get(`/user/passport/sendMessage?phone=${phone}`);
}

/**
 * @description: 注册新用户
 * @param {UserRegisterDTO} user 用户信息
 * @return {*}
 */
export async function registerUser(user: UserRegisterDTO): Promise<string> {
  return await request.post("/user/passport/register", user);
}

/**
 * @description: 获取当前用户信息
 * @param {*}
 * @return {*}
 */
export async function getMyInfo(): Promise<UserInfoDTO> {
  return await request.get("/user/myInfo");
}

/**
 * @description: 退出登录
 * @param {*}
 * @return {*}
 */
export async function logout(): Promise<boolean> {
  return await request.put("/user/logout");
}

/**
 * 上传头像
 * @param avatar 头像二进制文件
 */
export async function postAvatar(avatar: Blob): Promise<string> {
  const form = new FormData();
  form.append("file", avatar, "avatar.png");
  return await request.post("/file/avatar", form, {
    headers: {
      "Content-Type": "application/form-data",
    },
  });
}
