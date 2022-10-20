/*
 * @Date: 2022-09-10 22:32:04
 * @Author: 枫
 * @LastEditors: 枫
 * @description: 泛型工具
 * @LastEditTime: 2022-09-10 22:34:31
 */
// 分页数据
export type PaginationResponseData<T> = {
  content: T[];
  total: number;
};
