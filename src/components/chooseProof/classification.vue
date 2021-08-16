<template>
  <div class="container">
    <div class="title">
      <span class="tit">纳入证据分级</span>
    </div>
    <div class="line"></div>
    <h5>请您根据JBI干预性证据分级条目，对纳入的证据进行分级</h5>
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
            width="180"
          ></el-table-column>
          <el-table-column label=" 证据分级" width="180">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.level"
                placeholder="请选择"
                @change="change(scope.row.level, scope.$index)"
                ref="select"
                v-bind:disabled="!isShow"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="分级依据">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.levelReason"
                placeholder="请选择"
                @change="change1"
                ref="select"
                v-bind:disabled="!isShow"
              >
                <el-option
                  v-for="item in scope.row.options2"
                  :key="item.val"
                  :label="item.lab"
                  :value="item.val"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 参照表 -->
      <div class="reference">
        <div class="tau">
          <h6>证据等级</h6>
          <h5>设计类型举例</h5>
          <h4>描述</h4>
        </div>
        <div class="pau">
          <div class="box-leg">level 1</div>
          <div class="box-hed">RCT/实验性研究</div>
          <div class="box-rig">
            <p>1a—多项RCT的系统评价</p>
            <p>1b—多项RCT及其他干预性研究的系统评价</p>
            <p>1e—单项随机对照实验RCT</p>
            <p>1d—准随机对照实验</p>
          </div>
        </div>
        <div class="pau">
          <div class="box-leg">level 2</div>
          <div class="box-hed">类实验性研究</div>
          <div class="box-rig">
            <p>2a—多项类实验性研究的系统评价</p>
            <p>2b—多项类实验性研究与其他低质量干预性研究的系统评价</p>
            <p>2e—单项前瞻性有对照组的类实验性研究</p>
            <p>2d—前后对照/回顾性对照的类实验性研究</p>
          </div>
        </div>
        <div class="pau pau3">
          <div class="box-leg">level 3</div>
          <div class="box-hed">观察性-分析性研究</div>
          <div class="box-rig">
            <p>3a—多项队列研究的系统评价</p>
            <p>3b—多项队列研究与其他低质量观察性研究的系统评价</p>
            <p>3c—单项有对照组的队列研究</p>
            <p>3d—单项病例对照研究</p>
            <p>3e—单项无对照组的观察性研究</p>
          </div>
        </div>
        <div class="pau">
          <div class="box-leg">level 4</div>
          <div class="box-hed">观察性-描述性研究</div>
          <div class="box-rig">
            <p>4a—多项描述性研究的系统评价</p>
            <p>4b—单项横断面研究</p>
            <p>4e—病例系统研究</p>
            <p>4d—个案研究</p>
          </div>
        </div>
        <div class="pau pau2">
          <div class="box-leg">level 5</div>
          <div class="box-hed">专家意见/基础研究</div>
          <div class="box-rig">
            <p>5a—对专家意见的系统评价</p>
            <p>5b—对专家共识</p>
            <p>5c—基础研究/单项专家意见</p>
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
      indexNum: 7,
      isShow: true,
      options2: [],
      //level1对应下拉框
      level1Options: [
        {
          val: "1a—多项RCT的系统评价",
          lab: "1a—多项RCT的系统评价",
        },
        {
          val: "1b—多项RCT及其他干预性研究的系统评价",
          lab: "1b—多项RCT及其他干预性研究的系统评价",
        },
        {
          val: "1e—单项随机对照实验RCT",
          lab: "1e—单项随机对照实验RCT",
        },
        {
          val: "1d—准随机对照实验",
          lab: "1d—准随机对照实验",
        },
      ],
      //level2对应下拉框
      level2Options: [
        {
          val: "2a—多项类实验性研究的系统评价",
          lab: "2a—多项类实验性研究的系统评价",
        },
        {
          val: "2b—多项类实验性研究与其他低质量干预性研究的系统评价",
          lab: "2b—多项类实验性研究与其他低质量干预性研究的系统评价",
        },
        {
          val: "2e—单项前瞻性有对照组的类实验性研究",
          lab: "2e—单项前瞻性有对照组的类实验性研究",
        },
        {
          val: "2d—前后对照/回顾性对照的类实验性研究",
          lab: "2d—前后对照/回顾性对照的类实验性研究",
        },
      ],
      //level3对应下拉框
      level3Options: [
        {
          val: "3a—多项队列研究的系统评价",
          lab: "3a—多项队列研究的系统评价",
        },
        {
          val: "3b—多项队列研究与其他低质量观察性研究的系统评价",
          lab: "3b—多项队列研究与其他低质量观察性研究的系统评价",
        },
        {
          val: "3c—单项有对照组的队列研究",
          lab: "3c—单项有对照组的队列研究",
        },
        {
          val: "3d—单项病例对照研究",
          lab: "3d—单项病例对照研究",
        },
        {
          val: "3e—单项无对照组的观察性研究",
          lab: "3e—单项无对照组的观察性研究",
        },
      ],
      //level4对应下拉框
      level4Options: [
        {
          val: "4a—多项描述性研究的系统评价",
          lab: "4a—多项描述性研究的系统评价",
        },
        {
          val: "4b—单项横断面研究",
          lab: "4b—单项横断面研究",
        },
        {
          val: "4e—病例系统研究",
          lab: "4e—病例系统研究",
        },
        {
          val: "4d—个案研究",
          lab: "4d—个案研究",
        },
      ],
      //level5对应下拉框
      level5Options: [
        {
          val: "5a—对专家意见的系统评价",
          lab: "5a—对专家意见的系统评价",
        },
        {
          val: "5b—对专家共识",
          lab: "5b—对专家共识",
        },
        {
          val: "5c—基础研究/单项专家意见",
          lab: "5c—基础研究/单项专家意见",
        },
      ],
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
          id: 1,
          firstAuthor: "2016-05-02",
          level: "Level 1",
          levelReason: "1a—多项RCT的系统评价",
        },
      ],
      value: "",
      userTaskId: "",
      taskId: "",
    };
  },
  components: {},
  mounted() {
    this.userTaskId = localStorage.getItem("userTaskId");
    if (this.$store.state.stepNum > this.indexNum) {
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
        if (res.data.finishStepNum >= 7) {
          this.loadFileList();
        }
      }
    });

    //代修改 页面下一步是否进行
  },
  methods: {
    ...mapMutations(['setCurrentStep', 'setStepNum']),
    toNext() {
      try {
        this.tableData.forEach((item) => {
          if (
            item.level == null ||
            item.level == "" ||
            item.levelReason == null ||
            item.levelReason == ""
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
      this.updateLeal();
    },
    headClass() {
      //表头居中显示
      return "text-align:center";
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
            this.tableData.forEach((item, index) => {
              this.selectChange(item.level, index);
            });
          }
        }
      );
    },

    updateLeal() {
      var param = {
        userTaskId: this.userTaskId,
        leavlList: this.tableData,
      };
      this.httpPost("/pd/v1/updateLevel", param).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.setCurrentStep(8);
          this.setStepNum(8);
          this.$router.push(
            "/pd/stepRecommend/" + localStorage.getItem("taskId")
          );
        }
      });
    },

    /**
     * 下一步
     */
    next() {
      this.updateLeal();
    },
    //第一个下拉框分级
    change(val, index) {
      this.selectChange(val, index);
      this.$set(this.tableData[index], `levelReason`, "");
    },

    //依据下拉框
    change1(val) {},
    //下拉框变值
    selectChange(val, index) {
      if (val != null && val == "Level 1") {
        this.$set(this.tableData[index], `options2`, this.level1Options);
        // this.options2 = this.level1Options;
      }
      if (val != null && val == "Level 2") {
        this.$set(this.tableData[index], `options2`, this.level2Options);
        // this.options2 = this.level2Options;
      }
      if (val != null && val == "Level 3") {
        this.$set(this.tableData[index], `options2`, this.level3Options);
        // this.options2 = this.level3Options;
      }
      if (val != null && val == "Level 4") {
        this.$set(this.tableData[index], `options2`, this.level4Options);
        // this.options2 = this.level4Options;
      }
      if (val != null && val == "Level 5") {
        this.$set(this.tableData[index], `options2`, this.level5Options);
        // this.options2 = this.level5Options;
      }
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
    /deep/.el-table_1_column_3 {
      .el-input {
        width: 500px;
      }
    }
    /deep/.el-table_3_column_15 {
      .el-input {
        width: 535px;
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
      .pau3 {
        margin-bottom: 15px;
      }
      .tau {
        display: inline-flex;
        justify-items: center;
        height: 34px;
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
          height: 15px;
          text-align: center;
          line-height: 15px;
          font-size: 14px;
        }
        .box-hed {
          color: #4d4d4d;
          width: 336px;
          height: 15px;
          font-size: 14px;
          text-align: center;
          line-height: 15px;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .box-rig {
          color: #4d4d4d;
          text-align: left;
          line-height: 13px;
          height: 92px;
          font-size: 14px;
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