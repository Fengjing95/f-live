/*
 * @Date: 2022-06-26 14:00:39
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-27 17:16:31
 */
export interface ClassificationBase {
  classId: number;
  className: string;
  classIcon: string;
  classKey: string;
}

export type Classification = {
  [K in SelectArea]: boolean;
} & ClassificationBase;

export type SelectArea = "isGame" | "isRecreation" | "all";
