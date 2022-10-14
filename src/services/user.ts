/*
 * @Date: 2022-05-15 10:13:12
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-10-13 22:55:09
 */

import type {
  LoginDTO,
  UpdatePhoneDTO,
  UserInfoDTO,
  UserRegisterDTO,
} from "#/user";
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

/**
 * 更新用户基本信息
 * @param user 用户信息
 * @returns
 */
export async function submitUserInfo(
  user: Partial<UserInfoDTO>
): Promise<UserInfoDTO> {
  return await request.put("/user/myInfo", user);
}

/**
 * 更换绑定手机
 * @param phone 旧手机号/新手机号/验证码
 * @returns
 */
export async function updatePhone(phone: UpdatePhoneDTO): Promise<boolean> {
  return await request.put("/user/security/phone", phone);
}

/**
 * 更换邮箱绑定
 * @param email email 地址
 * @returns
 */
export async function updateEmail(email: string): Promise<boolean> {
  return await request.put("/user/security/email", { email });
}

/**
 * 修改密码
 * @param oldPassword 旧密码
 * @param password 新密码
 * @returns
 */
export async function updatePassword(value: {
  oldPassword: string;
  password: string;
}): Promise<boolean> {
  return await request.put("/user/security/password", value);
}

/**
 * 发送验证邮件
 */
export async function sendEmail(): Promise<boolean> {
  return await request.get("/user/security/sendEmail");
}

/**
 * 验证邮箱
 * @param code 校验码
 * @returns
 */
export async function validateEmail(code: string): Promise<boolean> {
  return !!(await request.put(`/user/security/email/validate/${code}`));
}
