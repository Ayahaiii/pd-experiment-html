<template>
  <div class="container">
    <el-row flex justify="center">
      <div class="wrap fl">
        <div class="title1-b">偱证干预项目开发-简介</div>
        <div class="part">
          <p class="indent">
            <span class="txt-b">偱证干预项目开发</span>旨在采用偱证理念与方法，根据干预问题结构化、循证和选证、项目设计、项目实施与评估、项目传播等步骤，开发出基于证据（Evidence-based）、经过实践检验、易于传播的干预项目。
          </p>
          <p class="indent">
            <span class="txt-b">干预项目：</span>一种旨在达成预期变化的各种策略的有机结合，既可以针对个体、家庭，也可以针对群体、组织、社会等干预目标。
          </p>
        </div>
          <video class="video-box"
               controls
               autoplay
               :poster="baseUrl+imgUrl"
               preload="auto"
               :src="flash">
        </video>
        <!-- <img src="../../assets/img/index-item.png" alt width="860px" height="600px" /> -->
        <div class="part">
          <div class="title1-b">实验背景：</div>
          <p>
            您是xx市社会科学院某研究所的科研人员，现需要您针对
            <span class="txt-b">“2型糖尿病中老年患者运动处方中的运动方式、运动强度”</span>问题，开发有证据支持的干预项目，
            <span class="txt-b">找到具有证据支持的运动方式与运动强度</span>。
          </p>
          <p>请您开始准备项目申报书，获得所需资源吧！</p>
        </div>

        <div class="start">
          <el-row type="flex" justify="center">
            <el-button type="danger" @click="toStart" v-if="status==1">开始实验</el-button>
            <el-button type="danger" @click="toContinue" v-if="status == 2">继续实验</el-button>
            <el-button type="danger" @click="toContinue" v-if="status == 3">查看实验</el-button>
          </el-row>
        </div>
      </div>
    </el-row>
    <div style="margin-bottom: 48px"></div>
  </div>
</template>


<script>
import { mapMutations } from "vuex";
export default {
  data() {

    return {
      ulId: localStorage.getItem('taskId'),
      id: null, //实验id
      userTaskId: null, //用户实验id
      status: 1, //1-已完成，2-未完成
      title: '',
      flash: '',
      summary: '',
      imgUrl: '',
      finishStepNum: 0,
    }
    
  },
  mounted() {
        this.id=localStorage.getItem('taskId');
        this.getDetail(this.id)
  },

  methods: {
  
    //请求实验简介
    getDetail(id) {
      let params = {
        id: this.id
      };
      this.httpPost("/pd/v1/getTaskDetail", params).then(res => {
        if (res.code == 0) {
            this.imgUrl=res.data.coverImg;
             this.flash=res.data.indexFlash
          //判断用户是重查看界面进来的还是重首页 进入
          let ifIndexOrSee = localStorage.getItem("ifIndexOrSee");
          if (ifIndexOrSee == 1 || ifIndexOrSee == null) {
              
            //判断当前是否为继续
            if (res.data.userTaskId != null) {
              this.status = 2;
              this.userTaskId = res.data.userTaskId;
              localStorage.setItem("userTaskId", this.userTaskId);
              this.setStepNum(res.data.finishStepNum);
              this.finishStepNum = res.data.finishStepNum;
              localStorage.setItem("finishStepNum",res.data.finishStepNum);
            }
          } else {
            this.status = 3;
            this.finishStepNum =parseInt(localStorage.getItem("finishStepNum"));
            this.userTaskId = localStorage.getItem("userTaskId");
            this.taskId = localStorage.getItem("taskId");
            this.setStepNum(this.finishStepNum);
          }
        }
      });
    },
    ...mapMutations(["setCurrentStep","setStepNum"]),
    //开始实验
    toStart() {
      let params = {
        taskId: this.id
      };
      this.httpPost("/pd/v1/addUserTask", params).then(res => {
        if (res && res.code === 0) {
          this.$store.commit("setStepNum",this.$store.state.stepNum + 1);
          this.userTaskId=res.data;
          localStorage.setItem("userTaskId", this.userTaskId);
          // 路由跳转
          this.$router.push('/pd/stepProblem/'+localStorage.getItem('taskId'));
          this.setCurrentStep(1);
          this.setStepNum(1);
        }
      });
    },

    //继续试验
    toContinue() {
     if (this.finishStepNum === 1) {
        let url = "/pd/stepProblem/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(1)
      } else if (this.finishStepNum === 2) {
        let url = "/pd/stepBook/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(2)
      } else if (this.finishStepNum === 3) {
        let url = "/pd/stepCheck/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(3)
      } else if (this.finishStepNum === 4) {
        let url = "/pd/stepBuild/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(4)
      } else if (this.finishStepNum === 5) {
        let url = "/pd/stepSelect/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(5)
      } else if (this.finishStepNum === 6) {
        let url = "/pd/stepUpload/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(6)
      } else if (this.finishStepNum === 7) {
        let url = "/pd/stepClassification/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(7)
      } else if (this.finishStepNum === 8) {
        let url = "/pd/stepRecommend/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(8)
      } else if (this.finishStepNum === 9) {
        let url = "/pd/stepOptimal/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(9)
      } else if (this.finishStepNum === 10) {
        let url = "/pd/result/"+this.ulId;
        this.$router.push(url);
        this.setCurrentStep(10)
      }
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.start .el-button {
  padding: 14px 55px;
  margin-bottom: 30px;
}
.container {
  .wrap {
    .part {
      margin-top: 20px;
    }
    img {
      margin: 10px auto;
    }
     video {
        width: 100%;
        position:absolute;
        height:100%;
    }
    .video-box {
        position:relative;
        width: 100%;
        height: 56%;
    }
  }
}
</style>