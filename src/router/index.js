import Vue from "vue";
import Router from "vue-router";
import login from "@/components/login";
import register from "@/components/register";
import index from "@/components/index";
import experList from "@/components/experList/experList"
Vue.use(Router);
 
const originalPush = Router.prototype.push;
 
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
export default new Router({
  mode: "history",
  base: "",
  routes: [
    {
      path: "/",
      redirect: "/pd/index"
    },
    {
      path: "/pd",
      redirect: "/pd/index"
    },
    {
      path: "/pd/login",
      name: "login",
      component: login
    },
    {
      path: "/pd/register",
      name: "register",
      component: register
    },
    {
      path: "/pd/index",
      component: index
    },
    {
      path: "/pd/steps",
      name: "pdSteps",
      redirect: '/pd/stepIntro',
      component: () =>
        import(/* webpackChunkName: Interview */ "@/components/index/index"),
      children: [
        {
          path: "/pd/stepIntro/:id",
          component: () =>
            import(
              /* webpackChunkName: ProjectInfo */ "@/components/intro/intro"
            )
        },
        {
          path: "/pd/stepProblem/:id",
          component: () =>
            import(
              /* webpackChunkName: ProjectInfo */ "@/components/declare/problem"
            )
        },
        {
          path: "/pd/stepBook/:id",
          component: () =>
            import(
              /* webpackChunkName: ProjectInfo */ "@/components/declare/book"
            )
        },
        {
          path: "/pd/stepCheck/:id",
          component: () =>
            import(
              /* webpackChunkName: ProjectInfo */ "@/components/declare/check"
            )
        },
        {
          path: "/pd/stepBuild/:id",
          component: () =>
            import(
              /* webpackChunkName: ProjectInfo */ "@/components/evidence/build"
            )
        },
        {
          path: "/pd/stepSelect/:id",
          component: () =>
            import(
              /* webpackChunkName: ProjectInfo */ "@/components/evidence/select"
            )
        },
        {
          // ??????????????????
          path: "/pd/stepUpload/:id",
          name: "experstepsIntroUpload",
          component: () =>
            import(
              /* webpackChunkName: ProjectInfo */ "@/components/chooseProof/uploadList"
            )
        },
        {
          // ????????????
          path: "/pd/stepClassification/:id",
          name: "experstepsIntroClassification",
          component: () =>
            import(
              /* webpackChunkName: ProjectInfo */ "@/components/chooseProof/classification"
            )
        },
        {
          // ????????????
          path: "/pd/stepRecommend/:id",
          name: "experstepsIntroRecommend",
          component: () =>
            import(
              /* webpackChunkName: ProjectInfo */ "@/components/chooseProof/recommend"
            )
        },
        {
          // ????????????
          path: "/pd/stepOptimal/:id",
          name: "experstepsIntroOptimal",
          component: () =>
            import(
              /* webpackChunkName: ProjectInfo */ "@/components/chooseProof/optimal"
            )
        },
        {
          // ????????????
          path: "/pd/result/:id",
          name: "experstepsIntroResult",
          component: () =>
            import(
              /* webpackChunkName: ProjectInfo */ "@/components/result/product"
            )
        }
      ]
    },
    {
      path: '/pd/experlist',
      name: 'experList',
      component: experList
    },
  ]
});
