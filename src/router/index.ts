/*
 * @Date: 2022-05-09 19:57:46
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-06-08 09:17:39
 */
import { createRouter, createWebHistory } from "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    menuName?: string;
    needLogin?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: {
        menuName: "首页",
      },
    },
    {
      path: "/classification",
      name: "classification",
      component: () => import("../views/Classification/ClassificationList.vue"),
      meta: {
        menuName: "分类",
      },
    },
    {
      path: "/like",
      name: "like",
      component: () => import("../views/Favorites/FavoriteList.vue"),
      meta: {
        menuName: "关注",
        needLogin: true,
      },
    },
    {
      path: "/live/:roomId",
      name: "live",
      component: () => import("../views/LiveRoom/LiveRoom.vue"),
      props: (route) => ({ roomId: route.params.roomId }),
    },
  ],
});

router.beforeEach((to) => {
  // 跳转路由之前修改标签页标题
  document.title = (to.meta.menuName ? to.meta.menuName + "_" : "") + "枫直播";
  return true;
});

export default router;
