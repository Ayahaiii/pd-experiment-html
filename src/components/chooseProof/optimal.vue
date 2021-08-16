<template>
  <div class="container">
    <div class="title">
      <span class="tit">最佳证据汇总</span>
    </div>
    <div class="line"></div>
    <h5>请根据前面的工作，对2型糖尿病中老年患者运动方式、运动强度进行最佳证据汇总，作为后期决策依据</h5>
    <div class="ware">
      <!-- 运动方式 -->
      <el-form :model="way_ruleForm" :rules="way_rules" ref="form">
        <div class="motion">
          <p>运动方式</p>
          <div class="shuru">
            <el-form-item prop="name">
              <el-input
                :disabled="!isShow"
                type="textarea"
                resize="none"
                :autosize="{ minRows: 2, maxRows: 10}"
                v-model="way_ruleForm.name"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </div>
          <div class="append">
            <el-form-item prop="date1">
              <el-select
                v-model="way_ruleForm.date1"
                value-key="item.value"
                placeholder="请选择"
                :disabled="!isShow"
                @change="way_showMessage"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.firstAuthor"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <p>{{ this.num }}</p>
            <h6>{{ this.recommend }}</h6>
            <el-button type="primary" @click="way_addto(way_ruleForm)" :disabled="!isShow">添加</el-button>
          </div>
          <div class="evidence">
            <div class="ant" v-for="(itme, index) in way" :key="index">
              <div class="tnt">{{ itme.waySummary }}</div>
              <p>{{ itme.level }}</p>
              <h6>{{ itme.recommendLevel }}</h6>
              <div class="iconfont icon-shanchu" v-if="isShow" @click="way_delel(index)"></div>
            </div>
          </div>
        </div>
      </el-form>
      <!-- 运动强度 -->
      <el-form :model="intensity_ruleForm" :rules="intensity_rules" ref="intensityform">
        <div class="motion motion2">
          <p>运动强度</p>
          <div class="shuru">
            <el-form-item prop="name">
              <el-input
                :disabled="!isShow"
                type="textarea"
                resize="none"
                :autosize="{ minRows: 2, maxRows:10}"
                v-model="intensity_ruleForm.name"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </div>
          <div class="append">
            <el-form-item prop="date1">
              <el-select
                :disabled="!isShow"
                v-model="intensity_ruleForm.date1"
                placeholder="请选择"
                value-key="item.value"
                @change="intensityshowMess"
              >
                <el-option
                  v-for="item in options1"
                  :key="item.id"
                  :label="item.firstAuthor"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <p>{{ this.num1 }}</p>
            <h6>{{ this.recommend1 }}</h6>
            <el-button type="primary" @click="intensityadd" :disabled="!isShow">添加</el-button>
          </div>
          <div class="evidence">
            <div class="ant" v-for="(itme, index) in intensity" :key="index">
              <div class="tnt">{{ itme.intensitySummary }}</div>
              <p>{{ itme.level }}</p>
              <h6>{{ itme.recommendLevel }}</h6>
              <div class="iconfont icon-shanchu" v-if="isShow" @click="intensitydel(index)"></div>
            </div>
          </div>
        </div>
      </el-form>
      <!-- 下一步按钮 -->

      <div class="setup">
        <el-button type="primary" @click="toNext" v-if="isShow">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      way_ruleForm: {
        name: "",
        date1: ""
      },
      way_rules: {
        name: [{ required: true, message: "请输入运动方式", trigger: "blur" }],
        date1: [
          {
            required: true,
            message: "请选择内容",
            trigger: "blur"
          }
        ]
      },
      intensity_ruleForm: {
        name: "",
        date1: ""
      },
      intensity_rules: {
        name: [{ required: true, message: "请输入运动方式", trigger: "blur" }],
        date1: [
          {
            required: true,
            message: "请选择内容",
            trigger: "blur"
          }
        ]
      },

      intensity: [],
      way: [],
      input1: "",
      value1: "",
      value2: "",
      value: "",
      input: "",
      point: "",
      point2: "",
      options: [],
      options1: [],
      input: "",
      input2: "",
      videoSrc: "",
      videoState: false,
      sizeForm: {
        name: ""
      },
      userTaskId: "",
      taskId: "",
      num: null,
      recommend: null,
      num1: null,
      recommend1: null,

      indexNum: 9,
      isShow: true
    };
  },
  components: {},
  mounted() {
    this.userTaskId = localStorage.getItem("userTaskId");
    if (
      this.$store.state.stepNum &&
      this.$store.state.stepNum > this.indexNum
    ) {
      this.isShow = false;
    }

    let params = {
      id: this.userTaskId
    };
    this.httpPost("/pd/v1/searchUserTaskById", params).then(res => {
      if (res && res.code == 0) {
        if (res.data.finishStepNum >= 9) {
          this.loadData();
        }
      }
    });
  },
  methods: {
    ...mapMutations(["setCurrentStep", "setStepNum"]),
    // 回显
    loadData() {
      let params = {
        id: this.userTaskId
      };
      this.httpPost("/pd/v1/getSummaryPageInfo", params).then(res => {
        if (res && res.code == 0) {
          this.options = res.data.pdUserTaskFiles;
          this.options1 = res.data.pdUserTaskFiles;
          this.way = res.data.goodExerciseWayFiles;
          this.intensity = res.data.goodExerciseIntensityFiles;
        }
      });
    },
    toNext() {
      if (this.way.length != 0 && this.intensity.length != 0) {
        var params = {
          way: this.way,
          intensity: this.intensity
        };
        this.httpPost("/pd/v1/updateSummaryPageInfo", params).then(res => {
          if (res && res.code == 0) {
            var params = {
              id: this.userTaskId
            };
            this.httpPost("/pd/v1/exportWord", params).then(res => {
              if (res.code == 0) {
                console.log("1");
                this.$router.push("/pd/result/1");
                this.setCurrentStep(10);
                this.setStepNum(10);
              }
            });
          }
        });
      } else {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$refs.intensityform.validate(valid => {
              if (valid) {
                var params = {
                  way: this.way,
                  intensity: this.intensity
                };
                this.httpPost("/pd/v1/updateSummaryPageInfo", params).then(
                  res => {
                    if (res && res.code == 0) {
                      var params = {
                        id: this.userTaskId
                      };
                      this.httpPost("/pd/v1/exportWord", params).then(res => {
                        if (res.code == 0) {
                          this.$router.push("/pd/result/1");
                          this.setCurrentStep(10);
                          this.setStepNum(10);
                        }
                      });
                    }
                  }
                );
                // alert('submit!');
                // callback(new Error("请选择二级分类"));
              } else {
                // console.log("error submit!!");
                // callback()
                return false;
              }
            });
            // alert('submit!');
            // callback(new Error("请选择二级分类"));
          } else {
            // console.log("error submit!!");
            // callback()
            return false;
          }
        });

        // this.$message.error("请填写完内容");
        // return false;
      }
    },
    // 增加运动方式的请求
    way_addto(form) {
      this.$refs.form.validate(valid => {
        if (valid) {
          var flag = true;

          for (var item in this.way) {
            if (this.way[item].id == this.way_ruleForm.date1) {
              this.$message1.error("请勿重复添加")
              flag = false;
            }
          }

          if (valid && flag) {
            for (var item in this.options) {
              // console.log(item)
              if (this.options[item].id === this.way_ruleForm.date1) {
                let content = this.options[item];
                (content.waySummary = this.way_ruleForm.name),
                  (content.ifGoodExerciseWay = 1),
                  this.way.push(content);
              }
            }
          }

          // alert('submit!');
          // callback(new Error("请选择二级分类"));
        } else {
          // console.log("error submit!!");
          // callback()
          return false;
        }
      });
      // let obj = {
      //   way_summary: this.input,
      //   level: this.num,
      //   recommendLevel: this.recommend
      // };
      // this.way.push(obj);
      // let params = {};
      // this.httpPost("", params).then(res => {
      //   if (res && res.code === 0) {
      //     this.$message({
      //       message: "成功保存！",
      //       type: "success"
      //     });
      //   }
      // });
    },

    // 增加运动强度的请求
    intensityadd(intensityform) {
      this.$refs.intensityform.validate(valid => {

         var flag = true;

          for (var item in this.intensity) {
            if (this.intensity[item].id == this.intensity_ruleForm.date1) {
              this.$message1.error("请勿重复添加")

              flag = false;
            }
          }

        if (valid && flag) {

          for (var item in this.options1) {
            // console.log(item)
            if (this.options1[item].id === this.intensity_ruleForm.date1) {
              let content = this.options1[item];
              (content.intensitySummary = this.intensity_ruleForm.name),
                (content.ifGoodExerciseIntensity = 1),
                this.intensity.push(content);
            }
          }
          // alert('submit!');
          // callback(new Error("请选择二级分类"));
        } else {
          // console.log("error submit!!");
          // callback()
          return false;
        }
      });

      // let obj = {
      //   intensity_summary: this.input1,
      //   level: this.num1,
      //   recommendLevel: this.recommend1
      // };
      // this.intensity.push(obj);
      // console.log(this.list);
      // let params = {};
      // this.httpPost("", params).then(res => {
      //   if (res && res.code === 0) {
      //     this.$message({
      //       message: "成功保存！",
      //       type: "success"
      //     });
      //   }
      // });
    },
    way_showMessage() {
      for (var item in this.options) {
        if (this.options[item].id == this.way_ruleForm.date1) {
          this.num = this.options[item].level;
          this.recommend = this.options[item].recommendLevel;
        }
      }
    },
    intensityshowMess() {
      for (var item in this.options1) {
        if (this.options1[item].id == this.intensity_ruleForm.date1) {
          this.num1 = this.options1[item].level;
          this.recommend1 = this.options1[item].recommendLevel;
        }
      }
    },
    // 第一个删除
    way_delel(index) {
      // console.log(index);
      // console.log("1");
      var item = this.way[index];
      // console.log(item);
      var params = {
        id: item.id,
        ifGoodExerciseWay: 2
      };
      // console.log(params);
      this.httpPost("/pd/v1/updateUserTaskFile", params).then(res => {
        if (res && res.code == 0) {
          // console.log(res.data);
        }
      });
      let arr = this.way;
      arr.splice(index, 1);
    },
    // 第二个删除
    intensitydel(index) {
      // console.log("2");
      var item = this.intensity[index];
      console.log(item);
      var params = {
        id: item.id,
        ifGoodExerciseIntensity: 2
      };
      // console.log(params);
      this.httpPost("/pd/v1/updateUserTaskFile", params).then(res => {
        if (res && res.code == 0) {
          // console.log(res.data);
        }
      });

      let arr = this.intensity;
      arr.splice(index, 1);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
/deep/.container .el-textarea__inner {
  color: #bbb;
  font-family: "Microsoft YaHei";
  line-height: 28px;
}

/deep/.el-form-item {
  margin: 0;
}

/deep/.el-input__inner {
  height: 60px;
}
/deep/.el-select {
  /deep/.el-input__inner {
    height: 40px;
  }
}
.container {
  width: 920px;
  float: right;
  .title {
    display: inline-flex;
    align-items: center;
    padding-bottom: 10px;
    .tit {
      color: #3ab5d7;
      font-size: 18px;
      font-weight: 350;
    }
  }

  h5 {
    color: #6b7277;
    font-size: 14px;
    margin: 15px 0 30px 0;
  }
  .line {
    width: 920px;
    height: 0px;
    border: 0.25px solid #ddd;
    margin-bottom: 30px;
  }
  .ware {
    .motion2 {
      margin-top: 76px;
    }
    .motion {
      .shuru {
        margin-bottom: 10px;
      }
      .append {
        width: 100%;
        display: inline-flex;
        align-items: center;
        p {
          width: 57px;
          height: 25px;
          margin-left: 40px;
          padding: 0;
        }
        h6 {
          width: 70px;
          height: 30px;
          // margin-left: 40px;
          font-size: 14px;
          font-weight: normal;
          margin: 20px 20px;
          line-height: 2;
          align-items: center;
          text-align: center;
        }
        button {
          width: 100px;
        }
      }
      .evidence {
        display: inline-flex;
        flex-direction: column;
        // align-items: center;
        // justify-content: center;
        .ant {
          display: inline-flex;
          border-bottom: 1px dashed black;
          margin-top: 10px;
          .tnt {
            width: 718px;
            // height: 51px;
            line-height: 2;
          }
          p {
            margin-left: 20px;
            padding: 0;
            line-height: 2;
          }
          h6 {
            // margin-left: 40px;
            font-size: 14px;
            font-weight: normal;
            margin: 0 0 0 20px;

            line-height: 2;
          }
          .iconfont {
            cursor: pointer;
            margin-left: 20px;
            font-size: 24px;
          }
        }
      }
    }
    .setup {
      width: 100%;
      display: inline-flex;
      justify-content: center;
      margin-top: 50px;
      margin-bottom: 30px;
      /deep/.el-button {
        width: 131px;
        height: 40px;
      }
    }
  }
}
</style>