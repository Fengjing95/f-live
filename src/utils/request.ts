/*
 * @Date: 2022-05-14 18:47:04
 * @Author: 枫
 * @LastEditors: 枫
 * @description: http fetch封装
 * @LastEditTime: 2022-10-20 14:40:08
 */
import axios from "axios";
import { Message } from "@arco-design/web-vue";
import { useUserStore } from "@/stores/user";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export const request = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshToken = false;
let requestQueue: Array<(token: string) => void> = [];

request.interceptors.request.use((config) => {
  NProgress.start();
  // 添加 token
  config.headers = Object.assign(config.headers || {}, {
    Authorization: useUserStore().getToken,
  });
  return config;
});

request.interceptors.response.use(
  async ({ data: response, config }) => {
    // 进度条
    NProgress.done();
    if (response?.code === 0) {
      return response.data;
    } else {
      switch (response?.code) {
        //? 40001 未认证状态码
        case 40001:
          if (!isRefreshToken) {
            // 如果不在刷新, 开始刷新
            isRefreshToken = true;
            return useUserStore()
              .refreshToken()
              .then((token) => {
                // TODO 返回值如何处理
                if (!token) return null;
                // 刷新成功之后进行重发
                requestQueue.forEach((cb) => cb(token));
                config.headers &&
                  (config.headers.Authorization = useUserStore().getToken);
                return request.request(config);
              })
              .finally(() => {
                // 清空任务队列, 标志位初始化
                requestQueue = [];
                isRefreshToken = false;
              });
          } else {
            // 如果正在刷新 token, 将请求加入队列
            return new Promise((resolve) => {
              requestQueue.push((token: string) => {
                config.headers && (config.headers.Authorization = token);
                resolve(request.request(config));
              });
            });
          }
        default:
          Message.warning(response.msg);
          return null;
      }
    }
  },
  (error) => {
    if (error.response.status === 401) {
      // TODO 身份过期清理所有的用户信息
      useUserStore().$reset();
      Message.warning("登陆后体验更多功能");
    } else {
      // TODO 根据不同的http 状态码处理
      Message.error(error.response.data.msg);
    }

    NProgress.done();
    return null;
  }
);

export const rtcRequest = axios.create({
  baseURL: "/srs",
  headers: {
    "Content-Type": "application/json",
  },
});
