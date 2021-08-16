<template>
  <div class="container">
    <div class="title">
      <span class="tit">证据推荐</span>
    </div>
    <div class="line"></div>
    <h5>请根据FAME证据推荐工具，对证据进行推荐评价，并提取其中相关的信息</h5>
    <div class="ware">
      <!-- 分级列表 -->
      <div class="grading">
        <el-table
          :data="tableData"
          border
          style="width: 100%"
          :header-cell-style="headClass"
        >
          <el-table-column
            prop="firstAuthor"
            label="作者（年份）"
            width="144"
          ></el-table-column>
          <el-table-column
            prop="level"
            label=" 证据等级"
            width="122"
          ></el-table-column>
          <el-table-column label="提取“运动方式”" width="183">
            <template slot-scope="scope">
              <el-input
                :disabled="!isShow"
                v-model="scope.row.exerciseWay"
                placeholder="请输入内容"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="提取“运动强度”" width="193">
            <template slot-scope="scope">
              <el-input
                :disabled="!isShow"
                v-model="scope.row.exerciseIntensity"
                placeholder="请输入内容"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="推荐细则评价" align="ceter" width="123">
            <template slot-scope="scope">
              <el-button type="text" @click="hangclick(scope.row, scope.$index)"
                >点击评价</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="recommendLevel"
            label="推荐等级"
            width="154"
          ></el-table-column>
        </el-table>
        <!-- 弹出层 -->
        <el-dialog
          title="推荐级别评价"
          :visible.sync="centerDialogVisible"
          top="15vh"
        >
          <el-table :data="gridData" border style="width: 100%">
            <el-table-column
              prop="title"
              label="证据推荐FAM结构"
              width="180"
            ></el-table-column>
            <el-table-column label="推荐级别" width="180">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.key"
                  clearable
                  placeholder="请选择"
                  :disabled="!isShow"
                >
                  <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="address1" label="判断依据">
              <template slot-scope="scope">
                <el-input
                  :disabled="!isShow"
                  v-model="scope.row.value"
                  placeholder="请输入内容"
                  @input="changee($event)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <div class="btn">
            <el-button type="primary" @click="submitResult">确定</el-button>
            <el-button type="primary" @click="centerDialogVisible = false"
              >取消</el-button
            >
          </div>
        </el-dialog>
      </div>

      <!-- 参照表 -->
      <div class="reference">
        <div class="tau">
          <h6>评价依据</h6>
          <h5>强推荐</h5>
          <h4>弱推荐</h4>
        </div>
        <div class="pau">
          <div class="box-leg">证据的可行性(Feasibility)</div>
          <div class="box-hed">明确显示干预措施利大于弊或弊大于利</div>
          <div class="box-rig">
            <p>干预措施利大于弊或弊大于利</p>
            <p>但证据尚不够明确</p>
          </div>
        </div>
        <div class="pau">
          <div class="box-leg">证据的适宜性</div>
          <div class="box-hed">高质量证据支持应用</div>
          <div class="box-rig">
            <p>有证据支持应用，尽管证据</p>
            <p>质量不够高</p>
          </div>
        </div>
        <div class="pau">
          <div class="box-leg">证据的临床意义</div>
          <div class="box-hed">对资源分配有利或无影响</div>
          <div class="box-rig">
            <p>对资源分配有利</p>
            <p>或无影响,或有较小</p>
            <p>影响</p>
          </div>
        </div>
        <div class="pau pau2">
          <div class="box-leg">证据的有效性</div>
          <div class="box-hed">考虑了患者的价值观，意愿和体验</div>
          <div class="box-rig">
            <p>部分考虑，或并为考虑患者</p>
            <p>的价值观，意愿和体验</p>
          </div>
        </div>
      </div>

      <!-- 下一步按钮 -->
      <div class="setup">
        <el-button type="primary" @click="toNext" v-if="isShow"
          >下一步</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      indexNum: 8,
      isShow: true,
      centerDialogVisible: false,
      input4: "",
      dialogTableVisible1: false,
      options2: [
        {
          value: "强推荐",
          label: "强推荐",
        },
        {
          value: "弱推荐",
          label: "弱推荐",
        },
        {
          value: "不清楚",
          label: "不清楚",
        },
      ],
      gridData: [
        {
          title: "证据的可行性（Feasibility）",
          key: "",
          value: "",
        },
        {
          title: "证据的适宜性（Appropriatness）",
          key: "",
          value: "",
        },
        {
          title: "证据的临床意义（Meanfullness）",
          key: "",
          value: "",
        },
        {
          title: "证据的有效性（Effectiveness）",
          value: "",
          value: "",
        },
      ],
      input2: "",
      input: "",
      options: [
        {
          value: "Level 1",
          label: "Level 1",
        },
        {
          value: "Level 2",
          label: "Level 2",
        },
        {
          value: "Level 3",
          label: "Level 3",
        },
        {
          value: "Level 4",
          label: "Level 4",
        },
        {
          value: "Level 5",
          label: "Level 5",
        },
      ],
      tableData: [
        {
          firstAuthor: "",
          level: "",
          exerciseWay: "",
          exerciseIntensity: "",
          recommendLevel: "",
        },
      ],
      value: "",
      userTaskId: "",
      taskId: "",
      listIndex: 1,
    };
  },
  components: {},
  mounted() {
    this.userTaskId = localStorage.getItem("userTaskId");

    if (
      this.$store.state.stepNum &&this.$store.state.stepNum > this.indexNum
    ) {
      this.isShow = false;
    }
    /**
     * 页面回显
     */
    let params = {
      id: this.userTaskId,
    };
    this.httpPost("/pd/v1/searchUserTaskById", params).then((res) => {
      if (res && res.code == 0) {
        if (res.data.finishStepNum >= 8) {
          this.loadFileList();
        }
      }
    });
    //代修改 页面下一步是否进行
  },
  methods: {
    ...mapMutations(['setCurrentStep', 'setStepNum']),
    toNext() {
      // console.log(this.tableData);
      try {
        this.tableData.forEach((item) => {
          if (
            item.exerciseWay == null ||
            item.exerciseWay == "" ||
            item.exerciseIntensity == null ||
            item.exerciseIntensity == "" ||
            item.recommendLevel == null ||
            item.recommendLevel == ""
          ) {
            throw new Error("");
          }
        });
      } catch (e) {
        this.$message({
          message: "未填写完成",
          type: "warning",
        });
        return;
      }
      this.keepListData();
      this.setCurrentStep(9);
      this.setStepNum(9);
    },

    next() {
      // console.log(this.tableData);
      this.keepListData();
    },
    /**
     * 保存数据
     */
    keepListData() {
      var param = {
        userTaskId: this.userTaskId,
        leavlReasonList: this.tableData,
      };
      this.httpPost("/pd/v1/updatelevelReason", param).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.$router.push(
            "/pd/stepOptimal/" + localStorage.getItem("taskId")
          );
        }
      });
    },
    /**
     * 页面加载
     */
    loadFileList() {
      this.userTaskId = localStorage.getItem("userTaskId");
      this.taskId = localStorage.getItem("taskId");
      var param = {
        id: this.userTaskId,
      };
      this.httpPost("/pd/v1/searchUserTaskFileByUserTaskId", param).then(
        (res) => {
          if (res.code == 0) {
            this.tableData = res.data;
            // this.tableData.forEach(item => {
            //   this.selectChange(item.level);
            // });
          }
        }
      );
    },
    //评价确认
    submitResult() {
      let statusType = "弱推荐";
      try {
        this.gridData.forEach((item) => {
          if (item.key == "强推荐") {
            statusType = "强推荐";
          }
          if (
            item.key == null ||
            item.value == null ||
            item.key == "" ||
            item.value == ""
          ) {
            throw new Error("");
            //  this.$message({
            //   message: '未填写完成',
            //   type: 'warning'
            // });
          }
        });
      } catch (e) {
        this.$message({
          message: "未填写完成",
          type: "warning",
        });
        return;
      }
      this.$set(this.tableData[this.listIndex], `recommendLevel`, statusType);
      this.$set(
        this.tableData[this.listIndex],
        `feasibilityLevel`,
        this.gridData[0].key
      );
      this.$set(
        this.tableData[this.listIndex],
        `feasibilityReason`,
        this.gridData[0].value
      );

      this.$set(
        this.tableData[this.listIndex],
        `appropriatenessLevel`,
        this.gridData[1].key
      );
      this.$set(
        this.tableData[this.listIndex],
        `appropriatenessReason`,
        this.gridData[1].value
      );

      this.$set(
        this.tableData[this.listIndex],
        `meaningLevel`,
        this.gridData[2].key
      );
      this.$set(
        this.tableData[this.listIndex],
        `meaningReason`,
        this.gridData[2].value
      );

      this.$set(
        this.tableData[this.listIndex],
        `effectivenessLevel`,
        this.gridData[3].key
      );
      this.$set(
        this.tableData[this.listIndex],
        `effectivenessReason`,
        this.gridData[3].value
      );
      // console.log(this.tableData[this.listIndex]);
      this.centerDialogVisible = false;
    },
    headClass() {
      //表头居中显示
      return "text-align:center";
    },
    change(val) {
      this.$refs.select.selected.currentLabel = val;
      // console.log(val);
      //  this.value1=val;
      //   vm.$set()
    },
    changee(e) {
      this.$forceUpdate();
    },
    hangclick(row, index) {
      this.listIndex = index;
      this.$set(this.gridData[0], `key`, row.feasibilityLevel);
      this.$set(this.gridData[0], `value`, row.feasibilityReason);

      this.$set(this.gridData[1], `key`, row.appropriatenessLevel);
      this.$set(this.gridData[1], `value`, row.appropriatenessReason);

      this.$set(this.gridData[2], `key`, row.meaningLevel);
      this.$set(this.gridData[2], `value`, row.meaningReason);

      this.$set(this.gridData[3], `key`, row.effectivenessLevel);
      this.$set(this.gridData[3], `value`, row.effectivenessReason);
      this.centerDialogVisible = true;
      // console.log(this.tableData[index].address = "强推荐")
      // console.log(this.tableData[index].address = "弱推荐")
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
/deep/.container .el-textarea__inner {
  color: #bbb;
  font-family: "Microsoft YaHei";
  line-height: 28px;
}
/deep/.el-table td {
  padding: 9px 0;
}
/deep/.el-table td,
.el-table th {
  text-align: center;
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
  .btn {
    width: 100%;
    margin-top: 20px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    /deep/.el-button {
      width: 172px;
      margin-left: 40px;
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
    margin-bottom: 17px;
  }
  .ware {
    /deep/.el-table_1_column_3 {
      .el-input {
        width: 161px;
      }
    }
    .setup {
      width: 100%;
      display: inline-flex;
      justify-content: center;
      margin-top: 50px;
      margin-bottom: 24px;
      /deep/.el-button {
        width: 131px;
        height: 40px;
      }
    }
    .reference {
      display: inline-flex;
      flex-direction: column;
      width: 811px;
      height: 100%;
      margin-left: 50px;
      margin-top: 100px;
      .tau {
        display: inline-flex;
        justify-items: center;
        height: 32px;
        align-items: center;
        border-top: 1px solid #4d4d4d;
        border-bottom: 1px solid #4d4d4d;
        h5 {
          width: 310px;
          height: 24px;
          color: #4d4d4d;
          text-align: center;
          line-height: 24px;
          margin: 0;
          font-size: 14px;
          font-weight: normal;
        }
        h6 {
          width: 100px;
          height: 24px;
          text-align: center;
          line-height: 24px;
          color: #4d4d4d;
          margin: 0;
          font-size: 14px;
          font-weight: normal;
        }
        h4 {
          width: 100px;
          color: #4d4d4d;
          height: 24px;
          text-align: center;
          line-height: 24px;
          margin: 0;
          font-size: 14px;
          font-weight: normal;
          flex: 1;
        }
      }
      .pau {
        display: inline-flex;
        margin-top: 10px;
        .box-leg {
          color: #4d4d4d;
          width: 100px;
          // font-weight: 600;
          height: 20px;
          text-align: center;
          line-height: 20px;
        }
        .box-hed {
          color: #4d4d4d;
          width: 336px;
          height: 20px;
          font-size: 14px;
          text-align: center;
          line-height: 20px;
        }
        .box-rig {
          p {
            text-align: center;
          }
          color: #4d4d4d;
          text-align: left;
          line-height: 20px;
          flex: 1;
        }
      }
      .pau2 {
        border-bottom: 1px solid #4d4d4d;
      }
    }
  }
}
</style>