<template>
  <div class="home">
    <el-container>
      <el-header class="header">
        <div><span>电商管理系统</span></div>
        <el-button type="info" @click="clear">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="collapseWidth" class="aside">
            <div class="toggleCollapse" @click="toggleCollapse">
                <span>|||</span>
            </div>
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            :unique-opened='true'
            :collapse='isCollapse'
            :collapse-transition='false'
            :router='true'
            
          >
            <el-submenu :index="String(item.id)" v-for="item in menulist" :key="item.id+''">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="'/'+ itemb.path" v-for="itemb in item.children" :key="itemb.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{itemb.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main">
            <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  created(){
      this.getMenuList()
  },
  data() {
    return {
        menulist:[],
        iconObj:{
            '125':'el-icon-s-custom',
            '103':'el-icon-s-tools',
            '101':'el-icon-s-goods',
            '102':'el-icon-s-order',
            '145':'el-icon-chat-dot-square'
        },
        isCollapse:false
    };
  },
  methods: {
    clear() {
      /* 退出清除sessionStorage token */
      window.sessionStorage.removeItem("token");
      this.$router.replace("/login");
    },
    async getMenuList(){
        /* 获取menulist数据 */
        const {data:res} = await this.$http.get('menus')
        if(res.meta.status !== 200) return this.$message.error('数据加载失败')
        this.menulist = res.data
    },
    toggleCollapse(){
        this.isCollapse = !this.isCollapse
    }
  },
  computed:{
      collapseWidth(){
          return this.isCollapse?'64px':'200px'
      }
  }
};
</script>

<style lang='less' scoped>
[class^=el-icon]{
    margin-right: 10px;
}
.home {
  height: 100vh;
  .header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
  }
  .aside {
    background-color: #333744;
    height: 100%;
    .el-menu-vertical-demo{
        border:0
    }
    .toggleCollapse{
        color: #fff;
        text-align: center;
        font-size: 14px;
        letter-spacing: 2px;
        cursor: pointer;
        height: 25px;
        line-height: 25px;
        background-color: #4A5064;
    }
  }
  .main {
    background-color: #eaedf1;
    height: 100%;
  }
}
section {
  height: 100%;
}
</style>