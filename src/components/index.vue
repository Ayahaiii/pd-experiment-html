<template>
  <div class="container">
    <c-header></c-header>
    <div class="wrap">
        <div class="title1-b">循证干预项目开发-简介</div>
        <p class="indent"><span class="txt-b">循证干预项目开发</span>旨在采用循证理念与方法，根据干预问题结构化、循证和选证、项目设计、项目测试与评估、项目传播等步骤，开发出基于证据（Evidence-based）、经过实践检验、易于传播的干预项目。开发的过程是一个包含研究人员、机构和从业人员相互合作的动态过程。
        <p class="indent">
            <span class="txt-b">干预项目：</span>一种旨在达成预期变化的各种策略的有机结合，既可以针对个体、家庭，也可以针对群体、组织、社会等干预目标，是一种有明确可行的目的的实现改变策略。在社会工作领域，干预通常旨在减少社会问题或健康问题。
        </p>
        <div class="title1-b">现有虚拟仿真项目开发</div>
        <div class="order">
            <span>排序：</span>
            <div class="btn" @click="order(0)"><span :class="{active: newActive}">最新<i class="el-icon-d-caret"></i></span></div>
            <div class="btn" @click="order(1)"><span :class="{active: viewActive}">浏览人数<i class="el-icon-d-caret"></i></span></div>
        </div>
        <div class="items">
            <div></div>
            <div class="item mr fl" @click="detailHandler(item.id)" v-for="(item,index) in list" :key="index">
                <img :src="baseUrl+item.coverImg" alt="" width="365px" height="250px">
                <div v-text="item.name"></div>
            </div>
        </div> 
        <div style="margin-bottom: 48px"></div>  
    </div>
    <c-footer></c-footer>
  </div>
</template>

<script>
import CHeader from './common/header'
import CFooter from './common/footer'
import {mapMutations} from 'vuex'
export default {
    data () {
        return {
            list: [],
            newActive: false,
            viewActive: false
        }
    },
    components: {
        CHeader,
        CFooter,
    },
    created(){
        // this.getStepNum();
    },
    mounted(){
        this.getExperimentsList()
        this.setCurrentStep(0);
        this.getStepNum();
    },
    methods: {
        getStepNum() {
            if (localStorage.getItem('userTaskId') == null) {
                    this.setStepNum(0)
                return
            }
            let params = {
                id: localStorage.getItem('userTaskId')
            }
            this.httpPost('/pd/getCurrentStep', params).then((res) => {
                if (res && res.code === 0) {
                    this.setStepNum(res.data.finishStepNum)
                }
            })
        },
        ...mapMutations(['setCurrentStep','setStepNum']),
        detailHandler(id){   
            localStorage.removeItem("userTaskId")
            localStorage.setItem('taskId',id);
            localStorage.setItem("ifIndexOrSee",1);
            localStorage.setItem('currentPage',0);
            let url =  '/pd/stepIntro/'+localStorage.getItem('taskId')
            this.$router.push(url)
        },
        //获取实验列表
        getExperimentsList(){
            let params = {
                pageNum: 1,
                pageSize: 12,
                createTimeAsc: 1,
                viewNumAsc: 2
            }
            this.httpPost("/pd/v1/getTaskList" , params).then(res => {
                if (res && res.code === 0) {
                this.list = res.data
                }
            });
        },
        //是否根据最新获取列表
        order (flag) {
            //最新
            let time = 2 
            let view = 2
            if(flag == 0){
                if(this.newActive == false){
                    time = 0 //时间倒序
                } else{
                    time = 1  //时间升序
                }
                this.newActive = !this.newActive
            }
            if(flag == 1){
                if(this.viewActive == false){
                    view = 1 //浏览次数倒序
                } else {
                    view = 0 //浏览次数升序
                }
                this.viewActive = !this.viewActive
            }
            let params = {
                pageNum: 1,
                pageSize: 12,
                createTimeAsc: time,
                viewNumAsc: view
            }
            this.httpPost("/pd/v1/getTaskList" , params).then(res => {
                if (res && res.code === 0) {
                this.list = res.data.data
                }
            });  
        },
    }  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
/deep/.start .el-button {
  padding: 14px 55px;
}
.container {
    width: 100%;
    .wrap {
        width: 1200px;
        margin: 0 auto;
        overflow: hidden;
        margin-top: 24px;
        margin-bottom: 100px;
        .title1-b {
            margin-top: 28px;
        }
        .order {
            height: 48px;
            line-height: 48px;
            border: 1px solid #ccc;
            color: #797979;
            margin-bottom: 50px;
            padding-left: 12px;
            span {
                float: left;
                margin-right: 12px;
                i { 
                    padding-left: 4px;
                    color: #797979
                }
            }
            .btn {
                cursor: pointer;
            }
            .btn:hover span {
                color: #1864af;
            }
            .btn:hover i {
                color: #1864af;
            }
            .btn .active{
                color:  #1864af;
                i{
                    color: #1864af;
                }
            }
        }
        .items {
            cursor: pointer;
            .item {
                box-sizing:border-box;
                -moz-box-sizing:border-box; /* Firefox */
                -webkit-box-sizing:border-box; /* Safari */
                width: 365px;
                color: #90949E;
            }
            
            .item:hover img {
                border: 1px solid #ff8711;
            }
            .item:hover div {
                color: #1864af;
            }
            .mr {
                margin-right: 52px;
            }
            .mr:nth-child(3n+3) {
                margin-right: 0;
            }
        }
        
    }
}
</style>