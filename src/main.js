// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store"
import http from "./utils/api";
import * as Util from './utils/utils'
import {
  baseUrl,
  httpGet,
  httpPost,
  httpPostToken
} from "./utils/httpService";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import VueCookies from "vue-cookies";
Vue.use(VueCookies);

import "./assets/style/common.css";
import "./assets/iconfont/iconfont.css";

Vue.config.productionTip = false;
Vue.prototype.$http = http;
Vue.prototype.httpGet = httpGet;
Vue.prototype.httpPost = httpPost;
Vue.prototype.getYMD = Util.getYMD;
Vue.prototype.httpPostToken = httpPostToken;
Vue.prototype.baseUrl = baseUrl;


// 引入element ui
import {Message} from "element-ui";
//解决Message弹出多个提示框
const showMessage = Symbol("showMessage");
class DonMessage {
  success(options, single = true) {
    this[showMessage]("success", options, single);
  }
  warning(options, single = true) {
    this[showMessage]("warning", options, single);
  }
  info(options, single = true) {
    this[showMessage]("info", options, single);
  }
  error(options, single = true) {
    this[showMessage]("error", options, single);
  }

  [showMessage](type, options, single) {
    if (single) {
      // 判断是否已存在Message
      if (document.getElementsByClassName("el-message").length === 0) {
        Message[type](options);
      }
    } else {
      Message[type](options);
    }
  }
}
Vue.prototype.$message1 = new DonMessage()


// 跳转后返回顶部
router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
})

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
