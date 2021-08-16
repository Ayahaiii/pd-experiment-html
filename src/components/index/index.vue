<template>
  <div class="container">
    <!-- 头部 -->
    <c-header></c-header>
    <!-- <h1>afd d{{$store.state.currentStep}}</h1> -->
    <!-- <h1>afdfdsa{{count1}}</h1> -->
    <!-- 主体 -->
    <div class="wrap">
      <!-- 侧栏菜单控制按钮 -->
      <div class="menu-btn fl" v-show="isBtn" @click="toggleEvent">
        <i class="iconfont icon-leibie1"></i>
      </div>
      <!-- 侧边栏 -->
      <div class="sider fl" v-show="isShow">
        <div class="title">
          <i class="iconfont icon-leibie1"></i>实验步骤
          <i @click="toggleEvent" class="iconfont icon-caidan1"></i>
        </div>
        <ul>
          <li class="li-out" @click="toggleLi(0)">
            <i class="iconfont icon-dian"></i>实验简介
          </li>
          <ul v-show="isShow0">
            <li @click="handleEvent(0)">
              <span>
                <i class="spot" :class="{spotLight: count1=== 0}"></i>
                <span :class="{active: count1===0}">实验简介</span>
              </span>
            </li>
          </ul>
          <li class="li-out" @click="toggleLi(1)">
            <i class="iconfont icon-dian"></i>实验申报
          </li>
          <ul v-show="isShow1">
            <li @click="handleEvent(1)">
              <span>
                <i class="spot" :class="{spotLight: count1===1}"></i>
                <span :class="{active: count1===1}">问题结构化</span>
              </span>
            </li>
            <li @click="handleEvent(2)">
              <span>
                <i class="spot" :class="{spotLight: count1===2}"></i>
                <span :class="{active: count1===2}">项目申报书</span>
              </span>
            </li>
            <li @click="handleEvent(3)">
              <span>
                <i class="spot" :class="{spotLight: count1===3}"></i>
                <span :class="{active: count1===3}">提交审核</span>
              </span>
            </li>
          </ul>
          <li class="li-out" @click="toggleLi(2)">
            <i class="iconfont icon-dian"></i>循证和选证
          </li>
          <ul v-show="isShow2">
            <li @click="handleEvent(4)">
              <span>
                <i class="spot" :class="{spotLight: count1===4}"></i>
                <span :class="{active: count1===4}">检索策略构建</span>
              </span>
            </li>
            <li @click="handleEvent(5)">
              <span>
                <i class="spot" :class="{spotLight: count1===5}"></i>
                <span :class="{active: count1===5}">证据检索与筛选</span>
              </span>
            </li>
            <li @click="handleEvent(6)">
              <span>
                <i class="spot" :class="{spotLight: count1===6}"></i>
                <span :class="{active: count1===6}">上传纳入研究</span>
              </span>
            </li>
            <li @click="handleEvent(7)">
              <span>
                <i class="spot" :class="{spotLight: count1===7}"></i>
                <span :class="{active: count1===7}">纳入证据分级</span>
              </span>
            </li>
            <li @click="handleEvent(8)">
              <span>
                <i class="spot" :class="{spotLight: count1===8}"></i>
                <span :class="{active: count1===8}">证据推荐</span>
              </span>
            </li>
            <li @click="handleEvent(9)">
              <span>
                <i class="spot" :class="{spotLight: count1===9}"></i>
                <span :class="{active: count1===9}">最佳证据汇总</span>
              </span>
            </li>
          </ul>
          <li class="li-out" @click="toggleLi(3)">
            <i class="iconfont icon-dian"></i>项目成果预览与验收
          </li>
          <ul v-show="isShow0">
            <li @click="handleEvent(10)">
              <span>
                <i class="spot" :class="{spotLight: count1=== 10}"></i>
                <span :class="{active: count1===10}">成果预览与验收</span>
              </span>
            </li>
          </ul>
        </ul>
      </div>
      <!-- 中心替换内容 -->
      <el-row type="flex" justify="center">
              <router-view></router-view>
      </el-row>
    </div>
    <div style="height: 101px"></div>
    <!-- 步骤提示栏 -->
    <div class="footer">
      <step></step>
    </div>
  </div>
</template>

<script>
import CHeader from "../common/header";
import CFooter from "../common/footer";
import step from "../common/step";
import {mapState,mapMutations} from "vuex"
export default {
  data() {
    return {
      ulId: localStorage.getItem('taskId'),
    //   currentStep: 0,
      isBtn: false,
      isShow: true,
      isShow0: true,
      isShow1: true,
      isShow2: true,
      isShow3: true,
      isShow4: true,
      isShow5: true
    };
  },
  components: {
    CHeader,
    CFooter,
    step
  },
  computed: {
      ...mapState({
          count1: state=>state.currentStep
      })
  },
  methods: {
    ...mapMutations(['setCurrentStep','setStepNum']),
    toggleEvent() {
      this.isShow = !this.isShow;
      this.isBtn = !this.isBtn;
    },
    toggleLi(tab) {
      if (tab == 0) {
        this.isShow0 = !this.isShow0;
      } else if (tab == 1) {
        this.isShow1 = !this.isShow1;
      } else if (tab == 2) {
        this.isShow2 = !this.isShow2;
      } else {
        this.isShow3 = !this.isShow3;
      }
    },
    handleEvent(menu) {
        if (menu > this.$store.state.stepNum) {
				this.$message1.info("请先完成当前步骤")
				return
			}
      if (menu === 0) {
        let url = "/pd/stepIntro/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(0)
      } else if (menu === 1) {
        let url = "/pd/stepProblem/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(1)
      } else if (menu === 2) {
        let url = "/pd/stepBook/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(2)
      } else if (menu === 3) {
        let url = "/pd/stepCheck/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(3)
      } else if (menu === 4) {
        let url = "/pd/stepBuild/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(4)
      } else if (menu === 5) {
        let url = "/pd/stepSelect/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(5)
      } else if (menu === 6) {
        let url = "/pd/stepUpload/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(6)
      } else if (menu === 7) {
        let url = "/pd/stepClassification/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(7)
      } else if (menu === 8) {
        let url = "/pd/stepRecommend/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(8)
      } else if (menu === 9) {
        let url = "/pd/stepOptimal/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(9)
      } else if (menu === 10) {
        let url = "/pd/result/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(10)
      }
    }
  }
};
</script>

<style lang="less" scoped>
.active {
  color: #1c61ac;
}
.spotLight {
  background-color: #1c61ac !important;
}
.container {
  // 主体
  .wrap {
    overflow: hidden;
    width: 1200px;
    margin: 40px auto 0px;
    // 侧栏菜单控制按钮
    .menu-btn {
      width: 40px;
      height: 40px;
      background: #0b75bb;
      margin-top: 5px;
      margin-right: 20px;
      padding: 10px 10px;
      // 图标样式
      .iconfont {
        font-size: 20px;
      }
      i {
        color: #fff;
      }
    }
    // 侧边栏
    .sider {
      margin-right: 80px;
      margin-bottom: 10px;
      width: 198px;
      overflow: hidden;
      zoom: 1;
      border: 1px solid #bbb;
      padding: 0px 1px;
      position: relative;
      .title,
      ul li {
        width: 192px;
        height: 42px;
        float: left;
        font-size: 14px;
        line-height: 42px;
        margin: 1px 1px;
        cursor: pointer;
        span {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      ul .li-out {
        background-color: #f2f2f2;
      }
      ul .spot {
        float: left;
        width: 4px;
        height: 4px;
        background-color: #999;
        line-height: 42px;
        margin: 18px 12px 0px 30px;
      }
      // 图标样式
      .iconfont {
        font-size: 20px;
      }
      .icon-leibie1 {
        color: #38a2dc;
        margin: 0px 16px;
      }
      .icon-caidan1 {
        float: right;
        margin-right: 16px;
        color: #999;
      }
      .icon-caidan1:hover {
        color: #38a2dc;
      }
      .icon-dian {
        font-size: 16px;
        margin: 0px 20px;
      }
      .rightContent {
        width: 920px;
        margin: 0 auto;
      }
    }
  }
  // 底部
  .bot {
    margin-bottom: 100px;
  }
  // 步骤提示栏
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>