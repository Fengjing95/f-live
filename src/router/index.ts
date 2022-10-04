/*
 * @Date: 2022-05-09 19:57:46
 * @Author: 枫
 * @LastEditors: 枫
 * @description: description
 * @LastEditTime: 2022-10-04 10:02:11
 */
import { createRouter, createWebHistory } from "vue-router";
import { IconNotification, IconUser } from "@arco-design/web-vue/es/icon";
import type { Component } from "vue";

declare module "vue-router" {
  interface RouteMeta {
    menuName?: string;
    needLogin?: boolean;
    key?: string;
    icon?: Component;
    name?: string;
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
      component: () => import("../views/Classification/ClassHome.vue"),
      meta: {
        menuName: "分类",
      },
      children: [
        {
          path: "",
          name: "classificationHome",
          component: () =>
            import("../views/Classification/ClassificationList.vue"),
        },
        {
          path: "/classification/:classKey",
          name: "classificationDetail",
          component: () => import("../views/Classification/RoomList.vue"),
          props: true,
        },
      ],
    },

    {
      path: "/citadel",
      name: "citadel",
      component: () => import("../views/StrongHold/StrongHold.vue"),
      children: [
        {
          path: "",
          name: "citadelHome",
          component: () => import("../views/StrongHold/FollowDynamic.vue"),
        },
        {
          path: ":citadelId",
          name: "citadelDetail",
          component: () => import("../views/StrongHold/CitadelDetail.vue"),
          props: (route) => ({ citadelId: Number(route.params.citadelId) }),
        },
        {
          path: ":citadelId/post/:postId",
          name: "postDetail",
          component: () => import("../views/StrongHold/PostDetail.vue"),
          props: (route) => ({
            citadelId: Number(route.params.citadelId),
            postId: Number(route.params.postId),
          }),
        },
      ],
      meta: {
        menuName: "根据地",
        needLogin: true,
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
    {
      path: "/member",
      name: "member",
      component: () => import("../views/MemberCenter/MemberCenter.vue"),
      children: [
        {
          path: "information",
          name: "memberInformation",
          component: () => import("../views/MemberCenter/MemberNotice.vue"),
          meta: {
            name: "个人资料",
            icon: IconUser,
            key: "information",
          },
        },
        {
          path: "notice",
          name: "memberNotice",
          component: () => import("../views/MemberCenter/MemberNotice.vue"),
          // props: (route) => ({ active: route.query.active || "thumb" }),
          meta: {
            name: "消息通知",
            icon: IconNotification,
            key: "notice",
          },
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  // 跳转路由之前修改标签页标题
  document.title = (to.meta.menuName ? to.meta.menuName + "_" : "") + "枫直播";
  return true;
});

export default router;
