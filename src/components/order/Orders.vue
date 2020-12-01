<template>
  <div class="orders">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="orderInfo.query"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="btnserach"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table区域 -->
      <el-table :data="orderlist" style="width: 100%" border stripe>
        <el-table-column label="序号" type="index" width="50px">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="220px">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="order_price" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button
              type="primary"
              size="mini"
              class="el-icon-edit"
              @click="btnEdit"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              class="el-icon-location-outline"
              @click="btnProgress"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="orderInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        ref="editForm"
        :model="editFormInfo"
        label-width="100px"
        :rules="editFormRules"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="editFormInfo.address1"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editFormInfo.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="progressDialogVisible"
      width="50%"
    >

    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";
export default {
  data() {
    return {
      progressInfo:[],
      progressDialogVisible:false,
      editFormInfo: {
        address1: [] /* 级联选择器 */,
        address2: "",
      },
      editDialogVisible: false,
      orderInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      orderlist: [],
      editFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      cityData,
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      let { data: res } = await this.$http.get(`orders`, {
        params: this.orderInfo,
      });
      if (res.meta.status !== 200) return this.$message.error("获取信息失败");

      this.orderlist = res.data.goods;
      this.total = res.data.total;
      console.log(res, this.orederlist);
    },
    handleSizeChange(newSize) {
      this.orderInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.orderInfo.pagenum = newPage;
      this.getOrderList();
    },
    btnserach() {},
    btnEdit() {
      this.editDialogVisible = true;
    },
    async btnProgress(){
      //接口失效
/*       let{data:res} = await this.$http.get(`/kuaidi/       1106975712662`)
      console.log(res);
      if(res.meta.status !== 200)return this.$message.error('获取物流进度失败!')

      this.progressInfo = res.data */
      

      this.progressDialogVisible = true;
    },
    editDialogClose() {
      this.$refs.editForm.resetFields();
    },

  },
};
</script>

<style lang='less' scoped>
</style>