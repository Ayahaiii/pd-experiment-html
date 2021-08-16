<template>
  <div class="container">
    <div class="title">
      <span class="tit">上传纳入研究</span>
    </div>
    <div class="line"></div>
    <h5>将下载的纳入文献全文上传</h5>
    <div class="ware">
      <!-- 上传文件 -->
      <div class="upload">
        <div class="updata">
          <el-upload
            :show-file-list="false"
            class="upload-demo"
            :action="baseUrl + uploadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handleSuccess"
            :headers="headerObj"
            accept=".PDF"
            :file-list="fileList"
          >
            <el-button size="small" type="primary" :disabled="!isShow"
              >选择上传</el-button
            >
          </el-upload>
          <div slot="tip" class="el-upload__tip" v-text="fileName"></div>
          <!-- <span v-text="fileName" style="color:red"></span>  -->
        </div>

        <el-form :model="sizeForm" :rules="rules" ref="form">
          <div class="literature">
            <p>文献名</p>
            <el-form-item prop="title">
              <el-input
                clearable
                v-model="sizeForm.title"
                placeholder="请输入正确文献名"
                :disabled="!isShow"
              ></el-input>
            </el-form-item>
          </div>
          <div class="author">
            <p>第一作者</p>
            <el-form-item prop="firstAuthor">
              <el-input
                clearable
                v-model="sizeForm.firstAuthor"
                placeholder="请输入“作者（年份）”"
                :disabled="!isShow"
              ></el-input>
            </el-form-item>
          </div>

          <div class="button1">
            <el-button @click="addFile(sizeForm)" :disabled="!isShow"
              >添加</el-button
            >
          </div>
        </el-form>
      </div>

      <!-- 上传列表 -->
      <div class="uplist">
        <h5>已上传文件列表：</h5>
        <div class="list-box">
          <el-table
            :data="tableData"
            style="width: 100%"
            :cell-style="{ textAlign: 'center' }"
            :header-cell-style="{ textAlign: 'center' }"
          >
            <el-table-column
              prop="id"
              label="序号"
              width="50px"
            ></el-table-column>
            <el-table-column
              prop="fileName"
              label="文件名"
              width="270px"
            ></el-table-column>
            <el-table-column
              prop="title"
              label="文献名"
              width="300px"
            ></el-table-column>
            <el-table-column
              prop="firstAuthor"
              label="第一作者（发表年份）"
              width="200px"
            ></el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 下一步按钮 -->

      <div class="setup">
        <el-button type="primary" v-if="isShow" @click="toNext"
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
      indexNum: 6,
      isShow: true,
      // baseUrl:'http://192.168.0.132:8077/pdapi',
      fileUrl: "",
      firstAuthor: "",
      title: "",
      fileName: "",
      userTaskId: 1,
      uploadUrl: "/pd/v1/uploadUserTaskFile",
      headerObj: {
        // Authorization: window.sessionStorage.getItem('token')
      },
      tableData: [],
      input: "",
      input2: "",
      fileList: [],
      videoSrc: "",
      videoState: false,
      sizeForm: {
        title: "",
        firstAuthor: "",
      },
      userTaskId: "",
      taskId: "",
      rules: {
        title: [
          { required: true, message: "请输入正确文献名", trigger: "blur" },
        ],
        firstAuthor: [
          { required: true, message: "请输入作者", trigger: "blur" },
        ],
      },
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
    //待修改用户是否完成此步

    let params = {
      id: this.userTaskId,
    };
    this.httpPost("/pd/v1/searchUserTaskById", params).then((res) => {
      if (res && res.code == 0) {
        if (res.data.finishStepNum > 6) {
          this.loadFileList();
        }
      }
    });
  },

  methods: {
    ...mapMutations(["setCurrentStep", "setStepNum"]),
    /**
     * 添加文件
     */
    addFile(form) {
      /**
       * 判断文件上传是否成功
       */
      this.$refs.form.validate((valid) => {
        if (valid && this.fileUrl != "") {
          var param = {
            title: this.sizeForm.title,
            fileName: this.fileName,
            userTaskId: this.userTaskId,
            firstAuthor: this.sizeForm.firstAuthor,
            url: this.fileUrl,
          };
          this.httpPost("/pd/v1/addUserTaskFile", param).then((res) => {
            if (res.code == 0) {
              this.$message({
                showClose: true,
                message: "添加成功",
                type: "success",
              });
              this.loadFileList();
              this.firstAuthor = "";
              this.title = "";
              this.sizeForm = {
                title: "",
                firstAuthor: "",
              };
              this.fileName = "";
            }
          });
          return;
          // alert('submit!');
          // callback(new Error("请选择二级分类"));
        } else {
          // console.log("error submit!!");
          // callback()
          this.$message1.error("缺少文件或内容");
          return false;
        }
      });
    },
    /**
     * 加载文件列表
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
          }
        }
      );
    },

    /**
     * 文件上传成功
     */
    handleSuccess(res) {
      if (res.code == 0) {
        this.fileName = res.data.fileName;
        this.fileUrl = res.data.fileUrl;
        var param = {
          name: this.fileName,
          url: this.fileUrl,
        };
        this.fileList.push(param);
        // console.log(this.fileList);
      }
    },
    /**
     * 删除文件
     */
    handleRemove(file) {
      // console.log(file);
    },
    /**
     * 上传文件之前
     */
    handlePreview(file) {
      // console.log(file);
    },
    handleExceed(files, fileList) {
      // this.$message.warning(
      //   `当前限制选择 3 个文件，本次选择了 ${
      //     files.length
      //   } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      // );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    toNext() {
      if (this.tableData.length < 1) {
        this.$message({
          message: "请添加文献",
          type: "warning",
        });
        return;
      }
      let params = {
          id: this.userTaskId,
        }
       this.httpPost('/pd/v1/nextStep', params).then((res) => {
        if(res.code==0){
             this.$message({
              message: '成功',
              type: 'success'
            });
            this.$router.push('/pd/stepClassification/'+localStorage.getItem('taskId'))
        }
      });
        
        this.setCurrentStep(7)
        this.setStepNum(7)
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
/deep/.el-form {
  display: flex;
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
    .upload {
      display: inline-flex;
      /deep/.el-upload {
        width: 111px;
        height: 37px;

        button {
          border: 1px solid #bbbbbb;
          background-color: white;
          width: 100%;
          height: 100%;
          span {
            color: black;
          }
        }
      }
      .literature {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-left: 50px;
        /deep/.el-input {
          width: 227px;
          height: 39px;
        }
        p {
          margin-right: 2px;
          width: 52px;
          height: 27px;
          line-height: 0.5;
          text-align: center;
          font-size: 13px;
        }
      }
      .author {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        margin-left: 30px;
        /deep/.el-input {
          width: 227px;
          height: 39px;
        }
        p {
          margin-right: 10px;
          width: 52px;
          line-height: 0.5;
          height: 27px;
          text-align: center;
          font-size: 13px;
        }
      }
      .button1 {
        margin-left: 58px;
        /deep/.el-button {
          border: 1px solid #5599c6;
          color: #5599c6;
        }
      }
    }
    .uplist {
      h5 {
        color: #6b7277;
        font-size: 14px;
        margin: 30px 0 15px 0;
      }
    }
    .setup {
      width: 100%;
      display: inline-flex;
      justify-content: center;
      margin-top: 100px;
      /deep/.el-button {
        width: 131px;
        height: 40px;
      }
    }
  }
}
</style>