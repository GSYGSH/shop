<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>


export default {
  name: 'app',
  components: {
    
  }
}
</script>

<style>
#app{
  height: 100%;
  overflow: hidden;
}
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-card {
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.15) !important;
  padding: 0 10px;
}
.el-table {
  font-size: 13px;
  margin-top: 20px;
}
.el-pagination{
  margin-top: 20px;
}
.el-cascader-panel{
  height: 200px;
}
</style>
