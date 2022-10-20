/*
 * @Date: 2022-06-21 19:49:35
 * @Author: 枫
 * @LastEditors: 枫
 * @description: IconFont 适配器
 * @LastEditTime: 2022-06-21 21:45:09
 */
import { Icon } from "@arco-design/web-vue";

// 表情图标
export const FacialIconFont = Icon.addFromIconFontCn({
  src: "/src/assets/facial/iconfont.js",
});

// 礼物图标
export const PresentIconFont = Icon.addFromIconFontCn({
  src: "/src/assets/present/iconfont.js",
});

// 通用图标
export const CommonIconFont = Icon.addFromIconFontCn({
  src: "/src/assets/common/iconfont.js",
});
