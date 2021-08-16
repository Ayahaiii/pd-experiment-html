<template>
  <div class="footer">
    <div class="wrap">
      <div class="itemone fl" @click="handleEvent(0)">
        <div class="circle fl" :class="{ activeCircle: count2 >= 0 }">
          <i
            class="iconfont icon-jianjie"
            :class="{ activeIconfont: count2 >= 0 }"
          ></i>
        </div>
        <div class="line fl"></div>
        <span class="fl txt active-txt" :class="{ activeTxt: count2 >= 0 }"
          >简介</span
        >
      </div>
      <div class="itemtwo fl" @click="handleEvent(1)">
        <div class="line fl"></div>
        <div class="circle fl" :class="{ activeCircle: count2 >= 1 }">
          <i
            class="iconfont icon-sbktlist"
            :class="{ activeIconfont: count2 >= 1 }"
          ></i>
        </div>
        <div class="line fl"></div>
        <span class="fl txt" :class="{ activeTxt: count2 >= 1 }">实验申报</span>
      </div>
      <div class="itemthree fl" @click="handleEvent(1)">
        <div class="line fl"></div>
        <div class="cir fl" :class="{ activeCircle: count2 >= 1 }"></div>
        <div class="line fl"></div>
        <span class="fl ml" :class="{ activeTxt: count2 >= 1 }">结构化</span>
      </div>
      <div class="itemthree fl" @click="handleEvent(2)">
        <div class="line fl"></div>
        <div class="cir fl" :class="{ activeCircle: count2 >= 2 }"></div>
        <div class="line fl"></div>
        <span class="fl ml" :class="{ activeTxt: count2 >= 2 }">申报书</span>
      </div>
      <div class="itemthree fl" @click="handleEvent(3)">
        <div class="line fl"></div>
        <div class="cir fl" :class="{ activeCircle: count2 >= 3 }"></div>
        <div class="line fl"></div>
        <span class="fl ml" :class="{ activeTxt: count2 >= 3 }">审核</span>
      </div>
      <div class="itemtwo fl" @click="handleEvent(4)">
        <div class="line fl"></div>
        <div class="circle fl" :class="{ activeCircle: count2 >= 4 }">
          <img
            src="../../assets/img/proof2.png"
            v-if="count2 < 4"
            alt=""
            width="30px"
          /><img
            src="../../assets/img/proof.png"
            v-if="count2 >= 4"
            alt=""
            width="30px"
          />
        </div>
        <div class="line fl"></div>
        <span class="fl txt" :class="{ activeTxt: count2 >= 4 }">偱/选证</span>
      </div>
      <div class="itemthree fl" @click="handleEvent(4)">
        <div class="line fl"></div>
        <div class="cir fl" :class="{ activeCircle: count2 >= 4 }"></div>
        <div class="line fl"></div>
        <span class="fl ml2" :class="{ activeTxt: count2 >= 4 }">检索构建</span>
      </div>
      <div class="itemthree fl" @click="handleEvent(5)">
        <div class="line fl"></div>
        <div class="cir fl" :class="{ activeCircle: count2 >= 5 }"></div>
        <div class="line fl"></div>
        <span class="fl ml2" :class="{ activeTxt: count2 >= 5 }">检索筛选</span>
      </div>
      <div class="itemthree fl" @click="handleEvent(6)">
        <div class="line fl"></div>
        <div class="cir fl" :class="{ activeCircle: count2 >= 6 }"></div>
        <div class="line fl"></div>
        <span class="fl" :class="{ activeTxt: count2 >= 6 }">纳入研究</span>
      </div>
      <div class="itemthree fl" @click="handleEvent(7)">
        <div class="line fl"></div>
        <div class="cir fl" :class="{ activeCircle: count2 >= 7 }"></div>
        <div class="line fl"></div>
        <span class="fl" :class="{ activeTxt: count2 >= 7 }">纳入分级</span>
      </div>
      <div class="itemthree fl" @click="handleEvent(8)">
        <div class="line fl"></div>
        <div class="cir fl" :class="{ activeCircle: count2 >= 8 }"></div>
        <div class="line fl"></div>
        <span class="fl" :class="{ activeTxt: count2 >= 8 }">证据推荐</span>
      </div>
      <div class="itemthree fl" @click="handleEvent(9)">
        <div class="line fl"></div>
        <div class="cir fl" :class="{ activeCircle: count2 >= 9 }"></div>
        <div class="line fl"></div>
        <span class="fl" :class="{ activeTxt: count2 >= 9 }">证据汇总</span>
      </div>
      <div class="itemfour fl" @click="handleEvent(10)">
        <div class="line fl"></div>
        <div class="circle fl" :class="{ activeCircle: count2 >= 10 }">
          <i
            class="iconfont icon-gongwenyuelan"
            :class="{ activeIconfont: count2 >= 10 }"
          ></i>
        </div>
        <span class="fl txt" :class="{ activeTxt: count2 >= 10 }"
          >阅览结果</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "step",
  data() {
    return {
      ulId: localStorage.getItem("taskId"),
      finishStepNum: 0,
    };
  },
  computed: {
    ...mapState({
      count2: (state) => state.stepNum,
    }),
    //   ...mapState({
    //       count2: state=>state.stepNum
    //   })
  },
  created() {
    this.getStepNum();
  },
  mounted() {
    // this.getStepNum()
  },
  methods: {
    ...mapMutations(["setCurrentStep", "setStepNum"]),
    getStepNum() {
      if (localStorage.getItem("userTaskId") == null) {
        this.$store.commit("setStepNum", 0);
        return;
      }
      let params = {
        id: localStorage.getItem("userTaskId"),
      };
      this.httpPost("/pd/getCurrentStep", params).then((res) => {
        if (res && res.code === 0) {
          this.setStepNum(res.data);
        }
      });
    },
    handleEvent(menu) {
      if (menu > this.$store.state.stepNum) {
        this.$message1.info("请先完成当前步骤");
        return;
      }
      if (menu === 0) {
        let url = "/pd/stepIntro/" + this.ulId;
        this.$router.push(url);
        this.setCurrentStep(0);
      } else if (menu === 1) {
        let url = "/pd/stepProblem/" + this.ulId;
        this.$router.push(url);
        this.setCurrentStep(1);
      } else if (menu === 2) {
        let url = "/pd/stepBook/" + this.ulId;
        this.$router.push(url);
        this.setCurrentStep(2);
      } else if (menu === 3) {
        let url = "/pd/stepCheck/" + this.ulId;
        this.$router.push(url);
        this.setCurrentStep(3);
      } else if (menu === 4) {
        let url = "/pd/stepBuild/" + this.ulId;
        this.$router.push(url);
        this.setCurrentStep(4);
      } else if (menu === 5) {
        let url = "/pd/stepSelect/" + this.ulId;
        this.$router.push(url);
        this.setCurrentStep(5);
      } else if (menu === 6) {
        let url = "/pd/stepUpload/" + this.ulId;
        this.$router.push(url);
        this.setCurrentStep(6);
      } else if (menu === 7) {
        let url = "/pd/stepClassification/" + this.ulId;
        this.$router.push(url);
        this.setCurrentStep(7);
      } else if (menu === 8) {
        let url = "/pd/stepRecommend/" + this.ulId;
        this.$router.push(url);
        this.setCurrentStep(8);
      } else if (menu === 9) {
        let url = "/pd/stepOptimal/" + this.ulId;
        this.$router.push(url);
        this.setCurrentStep(9);
      } else if (menu === 10) {
        let url = "/pd/result/" + this.ulId;
        this.$router.push(url);
        this.setCurrentStep(10);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.activeCircle {
  background-color: #3ab4d6;
  border-color: #3ab4d6 !important;
}
.activeTxt {
  color: #3ab4d6;
}
.activeIconfont {
  color: #fff !important;
}
span {
  font-size: 14px;
}
.iconfont {
  width: 100%;
  display: inline-block;
  line-height: 44px;
  font-size: 28px;
  color: #bbb;
  margin-left: 8px;
  margin-right: 8px;
}
.footer {
  border-top: 1px solid #bbb;
  background-color: #fbfbfb;
  height: 101px;
  .wrap {
    width: 956px;
    height: 60px;
    margin: 20px auto;
    .txt {
      font-weight: 600;
    }
    .itemone {
      width: 69px;
      cursor: pointer;
      span {
        padding-left: 5px;
      }
    }
    .itemfour {
      width: 69px;
      cursor: pointer;
      span {
        padding-left: 13px;
      }
    }
    .itemtwo {
      width: 94px;
      cursor: pointer;
      span {
        padding-left: 15px;
      }
      img {
        margin-left: 6px;
        margin-top: 6px;
      }
    }
    .itemthree {
      width: 70px;
      cursor: pointer;
      .ml2 {
        margin-left: 12px;
      }
      .ml {
        margin-left: 20px;
      }
    }
    .circle {
      width: 44px;
      height: 44px;
      border: 1px solid #bbb;
      border-radius: 50%;
    }
    .cir {
      width: 20px;
      height: 20px;
      border: 1px solid #bbb;
      border-radius: 50%;
      margin: 15px 0px;
      position: relative;
    }
    .line {
      width: 25px;
      height: 0.5px;
      background-color: #bbb;
      margin: 24px 0px;
    }
  }
}
</style>

