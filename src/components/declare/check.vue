<template>
  <div class="container">
    <div class="title">
      <span class="tit">提交审批</span>
    </div>
    <div class="line"></div>
    <div class="form">
      <el-form
        :model="sizeForm"
        :rules="rules"
        ref="form"
        label-width="100px"
        size="middle"
        label-position="right"
      >
        <el-form-item label="项目名称：">
          <div style="width: 700px">
            基于最佳证据的2型糖尿病中老年患者运动方式、运动强度--一项偱证干预研究
          </div>
        </el-form-item>
        <el-form-item
          label="研究问题："
          style="width: 800px; margin-top: 8px"
          prop="problem"
        >
          <el-input
            v-model="sizeForm.problem"
            :disabled="!isShow"
            placeholder="引用前面填写内容"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="研究方法："
          style="width: 800px; margin-top: 8px"
          prop="method"
        >
          <el-input
            v-model="sizeForm.method"
            :disabled="!isShow"
            placeholder="引用前面填写内容"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="预览成果："
          style="width: 800px; margin-top: 8px"
          prop="result"
        >
          <el-input
            v-model="sizeForm.result"
            :disabled="!isShow"
            placeholder="引用前面填写内容"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="申请时间："
          style="width: 800px; margin-top: 8px"
          prop="thme"
        >
          <div class="time-border">{{ dateTime }}</div>
        </el-form-item>
      </el-form>
      <div class="start">
        <el-row type="flex" justify="center">
          <el-button
            type="primary"
            @click="centerDialogVisible = true"
            v-if="isShow"
            >确认提交审核</el-button
          >
        </el-row>
      </div>
      <el-dialog
        title=""
        :visible.sync="centerDialogVisible"
        width="69%"
        center
      >
        <div class="notify">
          <div class="title txt">
            <h2>立项通知书</h2>
            <span>{{ userName }}（调用账户名称）同志：</span>
          </div>
          <div class="txt">
            <div>
              经XX市社会科学院某研究所科研领导小组专家评审组评审，相关领导小组审批，您申报的课题《基于最佳证据的2型糖尿病中老年患者运动方式、运动强度推荐————一项循证干预研究》，已被列为我院年度小课题，课题批准号为
              {{ authorizationNum }}，资助经费：10万元，为期两年。
            </div>
            <div>
              希根据制定的研究方案，认真开展课题研究工作。结题时，我院将组织课题鉴定工作。
            </div>
          </div>
          <div class="right txt">
            <div>XX市社会科学院某研究所（此处最好加上虚拟印章）</div>
            <div>{{ date }}</div>
          </div>
          <div class="start">
            <el-row type="flex" justify="center">
              <el-button type="primary" @click="onSubmit(sizeForm)"
                >确认提交</el-button
              >
            </el-row>
          </div>
        </div>
      </el-dialog>
    </div>
    <div style="margin-bottom: 48px"></div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      date: "",
      userName: this.$cookies.get("userInfo").name,
      indexNum: 3,
      isShow: true,
      userTaskId: "",
      centerDialogVisible: false,
      authorizationNum: "",
      dateTime: this.getYMD(),
      sizeForm: {
        problem: "",
        method: "",
        result: "",
      },
      rules: {
        problem: [
          { required: true, message: "研究问题不可为空", trigger: "blur" },
        ],
        method: [
          { required: true, message: "研究方法不可为空", trigger: "blur" },
        ],
        result: [
          { required: true, message: "预期成果不可为空", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    var aData = new Date();
    console.log(aData); //Wed Aug 21 2019 10:00:58 GMT+0800 (中国标准时间)

    this.date =
      aData.getFullYear() +
      "-" +
      (aData.getMonth() + 1) +
      "-" +
      aData.getDate();
    console.log(this.value); //2019-8-20
    this.userTaskId = localStorage.getItem("userTaskId");
    if (
      this.$store.state.stepNum &&
      this.$store.state.stepNum > this.indexNum
    ) {
      this.isShow = false;
    }

    let params = {
      id: this.userTaskId,
    };
    this.httpPost("/pd/v1/searchUserTaskById", params).then((res) => {
      if (res && res.code == 0) {
        if (res.data.finishStepNum >= 3) {
          this.loadData();
        }
        if (res.data.finishStepNum > 3) {
          this.dateTime = res.data.applyTime;
        }
      }
    });
  },
  methods: {
    ...mapMutations(["setCurrentStep", "setStepNum"]),
    // 回显
    loadData() {
      let params = {
        id: this.userTaskId,
      };
      this.httpPost("/pd/v1/searchUserTaskById", params).then((res) => {
        if (res && res.code == 0) {
          console.log(res.dataˆ);
          this.sizeForm.problem = res.data.researchQuestion;
          this.sizeForm.method = res.data.researchMethod;
          this.sizeForm.result = res.data.researchResult;
          this.authorizationNum = res.data.authorizationNum;
        }
      });
    },
    //编辑实验目的与工具
    onSubmit(form) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            id: this.userTaskId,
            researchQuestion: this.sizeForm.problem,
            researchMethod: this.sizeForm.method,
            researchResult: this.sizeForm.result,
            applyTime: this.dateTime,
          };
          this.httpPost("/pd/v1/updateUserTask", params).then((res) => {
            if (res && res.code === 0) {
              // 路由跳转
              this.$router.push(
                "/pd/stepBuild/" + localStorage.getItem("taskId")
              );
              this.setCurrentStep(4);
              this.setStepNum(4);
            }
          });
        } else {
          this.$message({
            message: "您提交审核的内容为空，请填写完整",
            type: "warning",
          });
          return false;
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
/deep/.textarea .el-textarea__inner {
  resize: none;
}
/deep/.main .el-textarea__inner {
  color: #bbb;
  font-family: "Microsoft YaHei";
  line-height: 28px;
}
.el-button--primary {
  background-color: #1476b6;
  border-color: #1476b6;
}
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
  .time-border {
    width: 300px;
    height: 44px;
    border: 1px solid #e4e4e4;
    padding-left: 12px;
    text-align: center;
  }
  .notify {
    span {
      text-align: center;
    }
    .title {
      text-align: center;
    }
    .txt {
      text-align: center;
      font-weight: 600;
      line-height: 28px;
      color: #707282;
      margin-top: 24px;
      margin-bottom: 24px;
    }
    .right {
      text-align: right;
      margin-right: 50px;
    }
  }
}
</style>