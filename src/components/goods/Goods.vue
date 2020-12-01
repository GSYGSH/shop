<template>
  <div class="goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 头部 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="getGoodsInfo.query"
            class="input-with-select"
            clearable
            @clear='getGoods'
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoods"
              
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- Table区域 -->
      <el-table :data="getGoodsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号" width="50px">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="800px">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width='95px'>
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width='70px'>
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width='140px'>
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" wdith="100px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteGoods(scope.row.goods_id) " icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getGoodsInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="getGoodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加商品对话框 -->
    <el-dialog title="添加商品" :visible.sync="addDialogVisible" width="50%">
      <el-form
        :model="addRuleForm"
        :rules="addRules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="addRuleForm.goods_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addRuleForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
      },
      addRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },

      addDialogVisible: false,

      searchValue: "",
      getGoodsList: [],
      getGoodsInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
    };
  },
  created() {
    this.getGoods();
  },
  methods: {
    /* 获取Goods数据 */
    async getGoods() {
      let { data: res } = await this.$http.get(`goods`, {
        params: this.getGoodsInfo,
      });
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      console.log(res);
      this.getGoodsList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.getGoodsInfo.pagesize = newSize;
      this.getGoods();
    },
    handleCurrentChange(newNum) {
      this.getGoodsInfo.pagenum = newNum;
      this.getGoods();
    },
    /* 编辑功能 */
    /* 删除功能 */
    async deleteGoods(id) {
      let confirm = await this.$confirm('此操作将永久删除该商品数据,是否继续?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).catch(err=>err)

      if(confirm !== 'confirm')return this.$message.info('已取消删除')
        let {data:res} = await this.$http.delete(`goods/${id}`)
        if(res.meta.status !== 200)return this.$message.error('删除失败')
      
        
        this.$message.success('删除成功')
        this.getGoods()
      },
      /* 添加商品跳转页面 */
      goAddPage(){
        this.$router.push('/goods/Add')
      } 
    },
  computed:{
  }
};
</script>

<style lang='less' scoped>
</style>