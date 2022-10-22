/*
 * @Date: 2022-09-17 18:58:37
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 自定义类型(wangEditor)
 * @LastEditTime: 2022-10-20 19:56:26
 */
import { SlateDescendant } from "@wangeditor/editor";

declare module "@wangeditor/editor" {
  // 扩展 Text
  interface SlateText {
    text: string;
  }

  // 扩展 Element
  interface SlateElement {
    type: string;
    children: SlateDescendant[];
  }
}

// declare module "xgplayer-flv";
// declare module "vue3-drag-resize";

// declare module "multistreamsmixer";
