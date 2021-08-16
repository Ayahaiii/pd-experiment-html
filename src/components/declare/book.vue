<template>
  <div class="container">
    <div class="title">
      <span class="tit">项目申报书</span>
    </div>
    <div class="line"></div>
    <div class="txt-small">您的研究思路已经明确，请撰写简单的项目申报书，用以获得支持</div>
    <div class="form">
      <el-form :model="sizeForm"
               :rules="rules"
               ref="form"
               label-width="100px"
               size="middle"
               label-position="left">
        <el-form-item label="研究问题："
                      prop="problem"
                      style="width: 800px;margin-top: 8px;">
          <el-input v-model="sizeForm.problem"
                    :disabled="!isShow"
                    placeholder="根据前面的PCIO内容，阐述您的研究问题"></el-input>
        </el-form-item>
        <el-form-item label="研究方法："
                      style="width: 800px;margin-top: 8px;"
                      prop="method">
          <el-input v-model="sizeForm.method"
                    :disabled="!isShow"
                    placeholder="说明您在研究中将运用的研究方法（实验法、调查法、定量分析法等等）"></el-input>
        </el-form-item>
        <el-form-item label="预期成果："
                      style="width: 800px;margin-top: 8px;"
                      prop="result">
          <el-input v-model="sizeForm.result"
                    :disabled="!isShow"
                    placeholder="阐述您的研究将会取得什么成果、解决什么问题"></el-input>
        </el-form-item>
      </el-form>
      <div class="start">
        <el-row type="flex"
                justify="center">
          <el-button type="primary"
                     @click="toNext(sizeForm)" v-if="isShow">下一步</el-button>
        </el-row>
      </div>

      <div style="margin-top: 100px"></div>
      <div>
        <div class="title1-b"
             style="color: #E52A25;font-weight: 500">知识拓展</div>
        <div><span class="txt-b">完整的项目申报书内容</span>包括以下部分：</div>
        <div>研究人与团队信息</div>
        <div>课题论证（国内外研究现状与研究意义、主要研究内容、基本思路、研究方法、重点难点、基本观点和创新之处）；</div>
        <div>完成项目研究的条件和保障；</div>
        <div>经费预算表等等内容。</div>
        <div>真正的项目申报书较为复杂，此处只提供简单体验。</div>
      </div>
    </div>
    <div style="margin-bottom: 48px"></div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      indexNum:2,
      isShow:true,
      userTaskId: '',
      sizeForm: {
        problem: '',
        method: '',
        result: '',
      },
      rules: {
        problem: [
          { required: true, message: '请阐述您的研究问题', trigger: 'blur' },
        ],
        method: [
          { required: true, message: '请阐述您的研究方法', trigger: 'blur' },
        ],
        result: [
          { required: true, message: '请阐述您的预期成果', trigger: 'blur' },
        ],
      },
    }
  },
  components: {},
  mounted() {
    this.userTaskId = localStorage.getItem('userTaskId')
    // console.log(this.$store.state.stepNum);
    if(this.$store.state.stepNum&&this.$store.state.stepNum>this.indexNum){
      this.isShow=false;
    }

    let params= {
        id: this.userTaskId
    }
     this.httpPost('/pd/v1/searchUserTaskById', params).then((res) => {
        if (res && res.code == 0) {
            if(res.data.finishStepNum>2){
                this.loadData()
            }
        }
     });
  },
  methods: {
    ...mapMutations(['setCurrentStep', 'setStepNum']),
    // 回显
    loadData() {
      let params = {
        id: this.userTaskId,
      }
      this.httpPost('/pd/v1/searchUserTaskById', params).then((res) => {
        if (res && res.code == 0) {
          this.sizeForm.problem = res.data.researchQuestion
          this.sizeForm.method = res.data.researchMethod
          this.sizeForm.result = res.data.researchResult
        }
      })
    },
    //编辑实验目的与工具
    toNext(form) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            id: this.userTaskId,
            researchQuestion: this.sizeForm.problem,
            researchMethod: this.sizeForm.method,
            researchResult: this.sizeForm.result,
          }
          this.httpPost('/pd/v1/updateUserTask', params).then((res) => {
            if (res && res.code === 0) {
              // 路由跳转
              this.$router.push(
                '/pd/stepCheck/' + localStorage.getItem('taskId')
              )
              this.setCurrentStep(3)
              this.setStepNum(3)
            }
          })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
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
}
</style>