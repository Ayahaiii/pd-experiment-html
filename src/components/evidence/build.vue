<template>
  <div class="container">
    <div class="title">
      <span class="tit">检索策略构建</span>
    </div>
    <div class="line"></div>
    <div class="txt-small">请根据关键词提示、实时检索调整，制定您的检索式</div>
    <div class="form">
      <el-form :model="sizeForm"
               :rules="rules"
               ref="form"
               label-width="120px"
               size="middle"
               label-position="left">
        <el-form-item label="中文检索式："
                      prop="chinese"
                      style="width: 800px;margin-top: 8px;">
          <el-input v-model="sizeForm.chinese"
                    :disabled="!isShow"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="英文检索式："
                      style="width: 800px;margin-top: 8px;"
                      prop="english">
          <el-input v-model="sizeForm.english"
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
      <div style="color:#FF898D">推荐数据库</div>
      <div>1、循证社会科学数据库（https://www.ringdata.com/evidence）</div>
      <div>2、知网（https://epub.cnki.net/kns/default.htm）</div>
      <div>3、CSSCI（http://cssci.nju.deu.cn/）</div>
      <div>4、美国糖尿病协会（https://www.diabetesjournals.org/search）（小技巧：针对相应问题，可关注不同行业协会资源）</div>
      <div>5、pubmed（http://pubmed.cn/）</div>
      <div>6、Web of science（http://apps.webofknowledge.com）</div>
      <div style="margin-top: 20px"></div>
      <div style="color:#FF898D">参考关键词</div>
      <div>英文参考关键词：</div>
      <div>diabetes mellitus、diabetes type2、T2DM</div>
      <div>exercise、exercise therapy、physical exercise、physical activity</div>
      <div>中文参考关键词：</div>
      <div>糖尿病、2型糖尿病、II型糖尿病</div>
      <div>运动、运动治疗、体力活动、体育锻炼、运动锻炼</div>
      <div style="margin-bottom: 48px"></div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      indexNum:4,
      isShow:true,
      userTaskId: '',
      sizeForm: {
        chinese: '',
        english: '',
      },
      rules: {
        chinese: [
          { required: true, message: '请输入中文检索内容', trigger: 'blur' },
        ],
        english: [
          { required: true, message: '请输入英文检索内容', trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {
    this.userTaskId = localStorage.getItem('userTaskId');
    if(this.$store.state.stepNum && this.$store.state.stepNum>this.indexNum){
          this.isShow=false;
        }

    let params= {
        id: this.userTaskId
    }
     this.httpPost('/pd/v1/searchUserTaskById', params).then((res) => {
        if (res && res.code == 0) {
            if(res.data.finishStepNum>4){
                this.loadData()
            }
        }
     });
  },
  methods: {
    // 回显
    loadData() {
      let params = {
        id: this.userTaskId,
      }
      this.httpPost('/pd/v1/searchUserTaskById', params).then((res) => {
        if (res && res.code == 0) {

          this.sizeForm.chinese = res.data.cnSearchParam
          this.sizeForm.english = res.data.enSearchParam
        }
      })
    },
    ...mapMutations(['setCurrentStep', 'setStepNum']),
    //编辑实验目的与工具
    toNext(form) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = {
            id: this.userTaskId,
            cnSearchParam: this.sizeForm.chinese,
            enSearchParam: this.sizeForm.english,
          }
          this.httpPost('pd/v1/updateUserTask', params).then((res) => {
            if (res && res.code === 0) {
              //   路由跳转
              this.$router.push(
                '/pd/stepSelect/' + localStorage.getItem('taskId')
              )
              this.setCurrentStep(5)
              this.setStepNum(5)
            }
          })
        } else {
          return false
        }
      })
      // let params = {
      // }
      // this.httpPost('', params).then((res) => {
      //   if (res && res.code === 0) {
      //     this.$message({
      //       message: '成功保存！',
      //       type: 'success',
      //     })
      //   }
      // })
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