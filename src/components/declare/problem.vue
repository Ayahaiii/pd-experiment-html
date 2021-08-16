<template>
  <div class="container">
    <div class="title">
      <span class="tit">问题结构化</span>
    </div>
    <div class="line"></div>
    <div class="txt-small">研究员您好！请根据PICO原则，明确您的研究问题，将其结构化</div>
    <div class="form">
      <el-form :model="sizeForm"
               :rules="rules"
               ref="form"
               label-width="100px"
               size="middle"
               label-position="left">
        <el-form-item label="项目名称："
                      prop="name">
          <div v-text="projectName"></div>
        </el-form-item>
        <el-form-item label="p："
                      style="width: 800px;margin-top: 8px;"
                      prop="p">
          <el-input v-model="sizeForm.p"
                  :disabled="!isShow"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="I："
                      style="width: 800px;margin-top: 8px;"
                      prop="i">
          <el-input v-model="sizeForm.i"
                    :disabled="!isShow"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="C："
                      style="width: 800px;margin-left: 8px;margin-top: 8px;"
                      prop="c">
          待定，暂时不用填写
        </el-form-item>
        <el-form-item label="O："
                      style="width: 800px;margin-top: 8px;"
                      prop="o">
          <el-input v-model="sizeForm.o"
                    :disabled="!isShow"
                    placeholder="请输入内容"></el-input>
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
        <div><span class="txt-b">PCIO</span>是基于循证医学（EBM）理论的一种将信息格式化的检索方式。<span class="txt-b">PCIO将每个问题分为四部分：</span></div>
        <div>population（对象）</div>
        <div>interventions（干预措施）</div>
        <div>comparisons（对照措施）</div>
        <div>outcomes（用于对比的结局指标）</div>
      </div>
    </div>
    <div style="margin-bottom: 48px"></div>
  </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
export default {
  data() {
    return {
      indexNum:1,
      isShow:true,
      projectName:
        '基于最佳证据的2型糖尿病中老年患者运动方式、运动强度--一项偱证干预研究',
      userTaskId: '',
      sizeForm: {
        p: null,
        i: null,
        q: null,
        o: null,
      },
      rules: {
        p: [{ required: true, message: '请输入P原则', trigger: 'blur' }],
        i: [{ required: true, message: '请输入I原则', trigger: 'blur' }],
        o: [{ required: true, message: '请输入o原则', trigger: 'blur' }],
      },
    }
  },
  components: {},
  computed: {
      ...mapState({
          count2: state=>state.stepNum
      })
  },
  created() {
    this.userTaskId = localStorage.getItem('userTaskId')
    if(this.count2&&this.count2>this.indexNum){
      this.isShow=false;
    }
    let params= {
        id: this.userTaskId
    }
     this.httpPost('/pd/v1/searchUserTaskById', params).then((res) => {
        if (res && res.code == 0) {
            if(res.data.finishStepNum>1){
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
          this.sizeForm.p = res.data.population
          this.sizeForm.i = res.data.intervention
          this.sizeForm.o = res.data.outcomes
        }
      })
    },
    toNext(formName) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            id: this.userTaskId,
            projectName: this.projectName,
            population: this.sizeForm.p,
            intervention: this.sizeForm.i,
            // comparisons: this.sizeForm.c,
            outcomes: this.sizeForm.o,
          }

          this.httpPost('/pd/v1/updateUserTask', params).then((res) => {
            if (res && res.code === 0) {
              // 路由跳转
              this.$router.push(
                '/pd/stepBook/' + localStorage.getItem('taskId')
              )
              this.setCurrentStep(2)
              this.setStepNum(2)
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