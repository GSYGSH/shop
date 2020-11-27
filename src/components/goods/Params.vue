<template>
  <div class="params">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告框 -->
      <el-alert
        title="注意！只允许第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类级级联选择框 -->
          <el-cascader
            v-model="currentcate"
            :options="catelist"
            :props="catelistProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tabs区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="btnDisabled"
            @click="AddDialogVisible = true"
            >动态参数</el-button
          >
          <!-- 动态表格 -->
          <el-table :data="manyTabData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环显示tag -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="tagClose(scope.row, i)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="序号"
              width="50px"
            ></el-table-column>
            <!-- attr_name列 -->
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="openEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delteParamsData(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="btnDisabled"
            @click="AddDialogVisible = true"
            >静态属性</el-button
          >
          <el-table :data="onlyTabData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环显示tag -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="tagClose(scope.row, i)"
                >
                  {{ item }}
                </el-tag>
                <!-- 添加tag -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column
              type="index"
              label="序号"
              width="50px"
            ></el-table-column>
            <!-- attr_name列 -->
            <el-table-column
              label="静态参数"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="openEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delteParamsData(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加' + AddFormText"
      :visible.sync="AddDialogVisible"
      width="50%"
      @close="AddDialogClose"
    >
      <el-form
        ref="addForm"
        :model="AddFormInfo"
        label-width="80px"
        :rules="AddFormRules"
      >
        <el-form-item :label="'添加' + AddFormText" prop="attr_name">
          <el-input v-model="AddFormInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog
      :title="'编辑' + AddFormText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        ref="editForm"
        :model="editFormInfo"
        label-width="80px"
        :rules="AddFormRules"
      >
        <el-form-item :label="'编辑' + AddFormText" prop="attr_name">
          <el-input v-model="editFormInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      attrID: "",
      AddFormRules: {
        attr_name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      editFormInfo: {
        attr_name: "",
      },
      AddFormInfo: {
        attr_name: "",
      },
      editDialogVisible: false,
      AddDialogVisible: false,
      manyTabData: [], //动态参数的数据
      onlyTabData: [], //静态参数的数据
      activeName: "many",
      catelist: [],
      /* 被选的数组 */
      currentcate: [],
      catelistProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      /* tag */
      tagValue: "",
    };
  },
  computed: {
    /* 按钮是否禁用 */
    btnDisabled() {
      return this.currentcate.length !== 3 ? true : false;
    },
    /* 获取选中的商品分类ID */
    cateID() {
      if (this.currentcate.length === 3) {
        return this.currentcate[2];
      }
      return null;
    },
    AddFormText() {
      if (this.activeName === "many") {
        return "参数";
      } else {
        return "属性";
      }
    },
  },
  methods: {
    async getCateList() {
      let { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return this.$message.error("请求数据失败");
      this.catelist = res.data;
    },
    async getParamsData() {
      if (this.currentcate.length !== 3) {
        this.currentcate = [];
        this.manyTabData = [];
        this.onlyTabData = [];
        return;
      } else {
        /* 当选择三级分类时，就发送请求更新数据 */
        let { data: res } = await this.$http.get(
          `categories/${this.cateID}/attributes`,
          {
            params: { sel: this.activeName },
          }
        );
        if (res.meta.status !== 200) return this.$message.error("获取信息失败");

        /* 遍历所有的item,把attr_vals修改 */
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals.split(",");
          if (item.attr_vals[0] == "") {
            item.attr_vals.shift();
          }
          item.inputVisible = false;
          item.inputValue = "";
        });
        if (this.activeName === "many") {
          this.manyTabData = res.data;
        } else {
          this.onlyTabData = res.data;
        }

        console.log(res);
      }
    },
    handleChange() {
      this.getParamsData();
      this.getCateList();
    },
    handleTabClick() {
      this.getParamsData();
      this.getCateList();
    },
    /* 添加分类 */
    addForm() {
      /* 预验证 */
      this.$refs.addForm.validate(async (value) => {
        if (!value) return;
        let { data: res } = await this.$http.post(
          `categories/${this.cateID}/attributes`,
          {
            attr_name: this.AddFormInfo.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) return this.$message.error("添加失败");

        this.$message.success("添加成功");
        this.getParamsData();
        this.AddDialogVisible = false;
      });
    },
    /* 编辑分类 */
    editForm() {
      /* 预验证 */
      this.$refs.editForm.validate(async (value) => {
        if (!value) return;
        let { data: res } = await this.$http.put(
          `categories/${this.cateID}/attributes/${this.attrID}`,
          {
            attr_name: this.editFormInfo.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 200) return this.$message.error("编辑失败");

        this.$message.success("编辑成功");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    /* 关闭重置 */
    AddDialogClose() {
      this.$refs.addForm.resetFields();
    },
    /* 关闭重置 */
    editDialogClose() {
      this.$refs.editForm.resetFields();
    },
    /* 打开编辑框，保存attr_id */
    openEditDialog(id) {
      this.editDialogVisible = true;
      this.attrID = id;
    },
    /* 删除参数/属性 */
    async delteParamsData(id) {
      this.attrID = id;
      let confirm = await this.$confirm(
        "此操作将会永久删除该参数或属性，是否继续",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirm !== "confirm") return this.$message.info("已取消删除");
      let { data: res } = await this.$http.delete(
        `categories/${this.cateID}/attributes/${this.attrID}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.getParamsData();
      this.$message.success("删除成功");
    },
    /* 点击显示tag input */
    showInput(row) {
      row.inputVisible = true;
      /* 获取光标 */
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    /* 提交新的tag和失去焦点 */
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      } else {
        row.attr_vals.push(row.inputValue);
        this.tagValue = row.attr_vals.join(",");

        let { data: res } = await this.$http.put(
          `categories/${this.cateID}/attributes/${row.attr_id}`,
          {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: this.tagValue,
          }
        );
        if (res.meta.status !== 200) return this.$message.error("添加错误");
        row.inputVisible = false;
        row.inputValue = "";
        this.$message.success("添加标签成功");
      }
    },
    async tagClose(row, i) {
      row.attr_vals.splice(i, 1);
      let { data: res } = await this.$http.put(
        `categories/${this.cateID}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(","),
        }
      );
      if (res.meta.status !== 200) return this.$message.error("删除错误");
      this.$message.success("删除成功");
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style lang='less' scoped>
.el-row {
  margin: 15px 0;
}
.el-tag {
  margin: 5px 10px;
}
.input-new-tag {
  width: 100px;
}
</style>