<template>
  <div class="container">
    <div class="title">
      <span class="tit">成果预览</span>
    </div>
    <div class="line"></div>
    <div class="ware">
      <p>项目开发成果报告</p>
      <iframe
        id="mainiframe"
        width="100%"
        height="800"
        :src="url+baseUrl+wordUrl"
        frameborder="0"
        scrolling="auto"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wordUrl:"",
      url:"http://view.officeapps.live.com/op/view.aspx?src=",
      sizeForm: {
        name: ""
      },
      userTaskId:"",
      id:""
    };
  },
  created(){
    this.userTaskId=localStorage.getItem("userTaskId");
    this.id = localStorage.getItem("taskId");
    this.getWordUrl();
  },
  components: {},
  // http://view.officeapps.live.com/op/view.aspx?src=https://cdn.ringdata.com/202010295084433%281%29.docx
  // created:function() {
   
  // },
  methods: {
     getWordUrl(){

        var param = {
          id: this.userTaskId
        };
        // console.log(param);
        this.httpPost("/pd/v1/searchUserTaskById", param).then(res => {
          if(res.code === 0){
            // console.log(res);
            this.wordUrl = res.data.resultFileUrl;
          }
        });
    },
    onSubmit() {
      // console.log("submit!");
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
/deep/.container .el-button {
  padding: 14px 55px;
  margin-left: 220px;
  background-color: #1476b6;
}
/deep/.form .el-form-item__label {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d16;
  margin-right: 40px;
}
.container {
  width: 920px;
  float: right;
  .title {
    padding-bottom: 10px;
    .tit {
      color: #3ab5d7;
      font-size: 18px;
      font-weight: 350;
    }
  }
  .line {
    width: 920px;
    height: 0px;
    border: 0.25px solid #ddd;
    margin-bottom: 43px;
  }
  .ware {
    width: 910px;
    height: 862px;
    p {
      margin-bottom: 10px;
      text-align: center;
      font-size: 14px;
    }
  }
}
</style>