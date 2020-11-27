<template>
  <div class="cate">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" 
          @click="showAddCateDialog"
          style="margin-bottom:15px"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="序号"
        border
        :show-row-hover="false"
      >
        <!-- 图标 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 等级排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="cateEdit(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="cateDelete(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateClose"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        label-width="80px"
        :rules="cateRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类父级">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
            style="width: 100%"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <el-form
        :model="editCateForm"
        label-width="80px"
        :rules="cateRules"
        ref="editFormRef"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="CateEditCommit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editCateForm: {
        cat_name: "",
        editID: "",
      },
      addCateForm: {
        cat_name: "",
        /* 父级分类ID */
        cat_pid: 0,
        /* 分类等级，默认要添加的是1级分类 */
        cat_level: 0,
      },
      /* 级联选择器配对对象 */
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: "true",
      },
      /* 选中的绑定的value */
      selectedKeys: [],
      cateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3-10个字符之间", tigger: "blur" },
        ],
      },
      parentCateList: [],
      queryInfo: { type: 3, pagenum: 1, pagesize: 10 },
      catelist: [],
      total: 0,
      addCateDialogVisible: false,
      editCateDialogVisible: false,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          /* 将当前列渲染成模板 */
          type: "template",
          /* 模板名称 */
          template: "isok",
        },
        {
          /* 排序 */
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
    };
  },
  methods: {
    async getCateList() {
      let { data: res } = await this.$http.get(`categories`, {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      /* 数据列表 */
      this.catelist = res.data.result;
      /* 为总数据条数赋值 */
      this.total = res.data.total;
      console.log(res);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getCateList();
    },
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    /* 获取父级分类数据 */
    async getParentCateList() {
      let { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级数据失败");
      this.parentCateList = res.data;
      console.log(res);
    },
    /* 级联选择器选中发生变化 */
    handleChange() {
      if (this.selectedKeys.length > 0) {
        /* 父级ID,选数组最后一个ID */
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        /* 等级 */
        this.addCateForm.cat_level = this.selectedKeys.length;
      } else {
        /* 不写默认一级分类 */
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    /* 点击按钮，添加新分类 */
    async addCate() {
      this.$refs.addCateFormRef.validate(async (value) => {
        if (!value) return;
        let { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) return this.$message.error("添加分类失败");

        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    /* 添加对话框关闭，重置数据 */
    addCateClose() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
    },
    /* 显示编辑cate对话框 */
    cateEdit(id) {
      this.editCateDialogVisible = true;
      this.editCateForm.editID = id;
    },
    /* 提交修改编辑 */
    async CateEditCommit() {
      this.$refs.editFormRef.validate(async (value) => {
        if (!value) return;
        let { data: res } = await this.$http.put(
          `categories/${this.editCateForm.editID}`,
          this.editCateForm
        );
        if (res.meta.status !== 200) return this.$message.error("获取信息失败");
        this.$message.success("修改成功");
        this.editCateDialogVisible = false;
        this.getCateList();
      });
    },
    /* 删除cate */
    async cateDelete(id) {
      let confirm = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirm !== "confirm") return this.$message.info("已取消删除");
      let { data: res } = await this.$http.delete(`categories/${id}`);
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      this.getCateList();
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style lang='less' scoped>
</style>