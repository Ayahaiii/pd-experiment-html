<template>
  <div class="container">
    <div class="title">
      <span class="tit">证据筛选流程</span>
    </div>
    <div class="line"></div>
    <div class="txt-small">根据您的检索与筛选情况，生成证据筛选流程图</div>
    <div style="margin-top: 12px"></div>
    <div class="txt-small">初步筛选</div>
    <div class="top">
      <el-row>
        <el-col :span="4">
          <div class="txt-small" style="line-height: 44px;">检索的文献数量：</div>
        </el-col>
        <el-col :span="20">
          <div class="fl">
            <el-form
              :inline="true"
              :model="dynamicValidateForm"
              ref="dynamicValidateForm"
              :ruleone="rules"
              label-width="100px"
              class="demo-dynamic"
            >
              <el-form-item
                v-for="(domain, index) in dynamicValidateForm.domains"
                :key="domain.key"
              >
                <el-form-item
                  :label="'数据库' + (index+1)"
                  :prop="'domains.' + index + '.database'"
                  :rules="{required: true, message: '不可为空', trigger: 'blur'
                }"
                >
                  <el-input
                    v-model="domain.database"
                    :disabled="!isShow"
                    placeholder
                    @keyup.native="proving"
                  ></el-input>
                </el-form-item>
                <el-form-item :label="'数量'" :prop="'domains.' + index + '.num'">
                  <el-input-number v-model="domain.num" :min="1" :disabled="!isShow" placeholder ></el-input-number>
                </el-form-item>
                <el-form-item>
                  <i class="el-icon-circle-plus-outline hand" @click="addDomain" v-if="isShow"></i>
                </el-form-item>
                <el-form-item>
                  <i
                    class="el-icon-close hand"
                    :disabled="!isShow"
                    @click.prevent="removeDomain(domain)"
                    v-if="isShow"
                  ></i>
                </el-form-item>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="spotline" style="margin: 32px 0px 24px"></div>
    <div class="box">
      <div style="margin-bottom: 8x">
        <el-form
          :inline="true"
          class="demo-form-inline demo-ruleForm"
          label-position="left"
          label-width="200px"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
        >
          <div class="txt-small">阅读全文筛选：</div>
          <el-form-item label="阅读全文后纳入：" prop="allLiteratureNum">
            <el-input v-model="ruleForm.allLiteratureNum" :disabled="!isShow" placeholder></el-input>
          </el-form-item>
          <el-form-item label="篇"></el-form-item>

          <div class="txt-small">获得合格文献：</div>
          <el-form-item label="排除不符合标准剩余：" prop="remainLiteratureNum">
            <el-input v-model="ruleForm.remainLiteratureNum" :disabled="!isShow" placeholder></el-input>
          </el-form-item>
          <el-form-item label="篇"></el-form-item>

          <div class="txt-small">最终纳入文献：</div>
          <el-form-item label="最终可用文献：" :disabled="!isShow" prop="finalLiteratureNum">
            <el-input v-model="ruleForm.finalLiteratureNum" :disabled="!isShow" placeholder></el-input>
          </el-form-item>
          <el-form-item label="篇"></el-form-item>
        </el-form>
      </div>
    </div>

    <div>
      <div class="start">
        <el-row type="flex" justify="center">
          <el-button type="primary" @click="toNext(dynamicValidateForm.domains)" v-if="isShow">下一步</el-button>
        </el-row>
      </div>
    </div>
    <div style="margin-bottom: 48px"></div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      // if (value <= 0) {
      //   callback(new Error('请输入大于0的整数'));
      // } else {
      //   callback();
      // }
      if (Number.isInteger(Number(value)) && Number(value) > 0) {
        callback();
      } else {
        callback(new Error("请输入大于0的整数"));
      }
    };
    return {
      indexNum: 5,
      isShow: true,
      userTaskId: "",
      dynamicValidateForm: {
        domains: [
          {
            database: '',
            num: null,
          },
        ],
      },
      ruleForm: {
        allLiteratureNum: "",
        remainLiteratureNum: "",
        finalLiteratureNum: ""
      },
      rules: {
        allLiteratureNum: [
          {
            required: true,
            validator: validatePass,
            message: "请输入正整数",
            trigger: "blur"
          }
        ],
        remainLiteratureNum: [
          {
            required: true,
            validator: validatePass,
            message: "请输入正整数",
            trigger: "blur"
          },
          ,
        ],
        finalLiteratureNum: [
          {
            required: true,
            validator: validatePass,
            message: "请输入正整数",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    if (
      this.$store.state.stepNum &&
      this.$store.state.stepNum > this.indexNum
    ) {
      this.isShow = false;
    }

    this.userTaskId = localStorage.getItem("userTaskId");
    let params = {
      id: this.userTaskId
    };
    this.httpPost("/pd/v1/searchUserTaskById", params).then(res => {
      if (res && res.code == 0) {
        if (res.data.finishStepNum > 5) {
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
      this.httpPost("/pd/v1/searchUserTaskById", params).then(res => {
        if (res && res.code == 0) {
          this.dynamicValidateForm.domains = JSON.parse(res.data.databaseNum);
          this.ruleForm.allLiteratureNum = res.data.allLiteratureNum;
          this.ruleForm.remainLiteratureNum = res.data.remainLiteratureNum;
          this.ruleForm.finalLiteratureNum = res.data.finalLiteratureNum;
        }
      });
    },
    removeDomain(item) {
      if (this.dynamicValidateForm.domains.length > 1) {
        var index = this.dynamicValidateForm.domains.indexOf(item);
        if (index !== -1) {
          this.dynamicValidateForm.domains.splice(index, 1);
        }
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({});
    },
    toNext(form) {
      this.$refs.dynamicValidateForm.validate(valid => {
        if (valid) {
          this.$refs.ruleForm.validate(valid => {
            if (valid) {
              let params = {
                id: this.userTaskId,
                databaseNum: JSON.stringify(this.dynamicValidateForm.domains),
                allLiteratureNum: this.ruleForm.allLiteratureNum,
                remainLiteratureNum: this.ruleForm.remainLiteratureNum,
                finalLiteratureNum: this.ruleForm.finalLiteratureNum
              };
              this.httpPost("/pd/v1/updateUserTask", params).then(res => {
                if (res && res.code == 0) {
                  this.$router.push(
                    "/pd/stepUpload/" + localStorage.getItem("taskId")
                  );
                  this.setCurrentStep(6);
                  this.setStepNum(6);
                }
              });
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.form .el-form-item__label {
  font-size: 14px;
  font-weight: 600;
  color: #737b7f;
}
/deep/.start .el-button {
  padding: 14px 55px;
  background-color: #1476b6;
}
/deep/.start .el-button:hover {
  padding: 14px 55px;
  background-color: #1a87cf;
}
.container {
  .title {
    padding-bottom: 10px;
    .tit {
      color: #3ab5d7;
      font-size: 18px;
      font-weight: 350;
    }
  }
  .top {
    i {
      display: inline-block;
      height: 44px;
      width: 44px;
      line-height: 44px;
      font-size: 24px;
      color: #818181;
    }
  }
  .txt {
    color: #767fa5;
    line-height: 44px;
    margin-right: 12px;
  }

  .spotline {
    width: 920px;
    height: 0.5px;
    border: 1px dashed #c1c1c1;
  }
  .box {
    overflow: hidden;
    margin-bottom: 16px;
    .txt2 {
      width: 150px;
      height: 44px;
      color: #767fa5;
      line-height: 44px;
      margin-right: 12px;
    }
  }
}
</style>