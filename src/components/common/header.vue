<template>
  <div class="container">
    <div class="fl hand" @click="returnIndex">
      <img
        class="fl"
        src="../../assets/img/logo.png"
        alt=""
        width="50px"
        height="50px"
      />
      <div class="fl">
        <span class="txt1-left">循证社会工作虚拟仿真实验平台</span>
        <span class="txt2-left">偱证干预项目开发-实验平台</span>
      </div>
    </div>
    <div class="fr">
      <span class="home" @click="returnIndex"
        ><i class="iconfont icon-shouye"></i>首页</span
      >
      <i class="el-icon-user"></i>
      <div class="txt-right">欢迎 {{ userName }}访问实验！</div>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link hand" style="color: #fff !important">
          {{ userName }} <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="my">我的实验</el-dropdown-item>
          <el-dropdown-item command="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "CHeader",
  data() {
    return {
      userName: this.$cookies.get("userInfo").name,
    };
  },
  mounted() {
    this.ifLogin();
    if (this.$cookies.isKey("userInfo")) {
      this.userName = this.$cookies.get("userInfo").name;
    }
  },
  methods: {
    returnIndex() {
      this.$router.push("/pd/index");
    },
    handleCommand(command) {
      if (command === "my") {
        this.$router.push("/pd/experlist");
      } else {
        localStorage.removeItem("userTaskId");
        localStorage.removeItem("taskId");
        /**
         * 退出清除登录的cookie值
         */
        this.$cookies.remove("tokenWeb");
        this.$cookies.remove("userInfo");
        this.$router.push("/pd/login");
        //localStorage.clear();
      }
    },
    ifLogin() {
      if (!this.$cookies.isKey("tokenWeb")) {
        this.$message1.warning("用户未登录");
        this.$router.push("/pd/login");
      }
    },
  },
};
</script>

<style lang="less" scoped>
// 主体样式
.container {
  width: 100%;
  background: #0b75bb;
  color: #fff;
  height: 86px;
  padding: 0px 34px;
  .home {
    display: inline-block;
    width: 60px;
    text-align: center;
    height: 86px;
    line-height: 86px;
    cursor: pointer;
    margin-right: 24px;
    i {
      font-size: 20px;
      line-height: 86px;
    }
  }
  img {
    margin: 18px 12px 18px 12px;
  }
  .txt1-left {
    display: inline-block;
    font-size: 24px;
    line-height: 86px;
  }
  .txt2-left {
    display: inline-block;
    font-size: 22px;
    font-weight: 500;
    line-height: 86px;
    color: #eca50c;
    padding-left: 28px;
  }
  // 图标样式
  .el-icon-user {
    font-size: 20px;
  }
  i {
    display: inline-block;
    margin-right: 12px;
    line-height: 86px;
  }
  .txt-right {
    display: inline-block;
    line-height: 86px;
    margin-right: 28px;
  }
}
</style>


