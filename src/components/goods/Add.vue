<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告区 -->
      <el-alert
        title="消息提示的文案"
        type="info"
        center
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="stepIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品照片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- Tab选项栏 -->
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        label-position="top"
        :rules="tabFormRules"
      >
        <el-tabs
          tab-position="left"
          v-model="stepIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabsClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cate">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleOptionChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabData"
              :key="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                  size="medium"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTabData"
              :key="item.attr_name"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品照片" name="3">
            <el-upload
              :action="actionURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              class="content-edit"
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button @click="btnAdd" type="primary" style="margin-top: 20px"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="预览" :visible.sync="dialogImgVisible" width="50%">
      <img :src="ImgUrl" alt="" style="width: 100%" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ImgUrl: "",
      dialogImgVisible: false,
      headerObj: { Authorization: window.sessionStorage.getItem("token") },
      actionURL: "http://120.53.120.229:8888/api/private/v1/upload",
      selectedOption: {},
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },

      catelist: [],

      /* 对应索引 */
      stepIndex: "0",

      addForm: {
        attrs: [],
        pics: [],
        goods_name: "",
        /*         goods_cat: "", */
        goods_price: null,
        goods_number: null,
        goods_weight: null,
        /* 商品的描述 */
        goods_introduce: "",
        /* 选中的option */
        goods_cat: [],
      },
      tabFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },
      manyTabData: [],
      onlyTabData: [],

    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      let { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.catelist = res.data;
    },
    /* 判断是否三级菜单,不是就清空 */
    handleOptionChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat.length = [];
        return;
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择三级分类");
        return false;
      }
    },
    async tabsClick() {
      if (this.stepIndex === "1") {
        let { data: res } = await this.$http.get(
          `categories/${this.cateID}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) return this.$message.error("请求数据失败");
        this.manyTabData = res.data;
        /* 把attr_vals动态属性分割成数组 */
        this.manyTabData.forEach((item) => {
          if (item.attr_vals !== "") {
            item.attr_vals = item.attr_vals.split(",");
          }
        });
        console.log(this.manyTabData);
      } else if (this.stepIndex === "2") {
        let { data: res } = await this.$http.get(
          `categories/${this.cateID}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) return this.$message.error("请求数据失败");
        this.onlyTabData = res.data;
        console.log(this.onlyTabData);
      }
    },
    /* 图片预览 */
    handlePreview(file) {
      console.log(file);
      this.dialogImgVisible = true;
      this.ImgUrl = "http://120.53.120.229:8888/" + file.response.data.tmp_path;
    },
    /* 上传图片成功 */
    handleSuccess(response) {
      let picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },
    /* 移除图片 */
    handleRemove(file) {
      let path = file.response.data.tmp_path;
      let index = this.addForm.pics.findIndex((x) => {
        x.pic === path;
      });
      this.addForm.pics.splice(index, 1);
      this.$message.success("删除成功");
    },
    /* 添加商品 */
    btnAdd() {
      this.$refs.addForm.validate(async (vaild) => {
        if (!vaild) {
          return this.$message.error("请按要求填写信息");
        }
        /* 深拷贝再转为字符串形式 */
        let GoodCat = JSON.parse(JSON.stringify(this.addForm.goods_cat)).join(
          ","
        );
        /* 将manyTabData里面的数据转换成只带有id和value */
        this.manyTabData.forEach((item) => {
          let attr = {
            attr_id: item.attr_id,
            attr_value: (function (vals) {
              if (vals === "") {
                return "";
              } else {
                return vals.join(",");
              }
            })(item.attr_vals),
          };
          this.addForm.attrs.push(attr);
        });

        /* 将onlyTabData里面的数据转换 */
        this.onlyTabData.forEach((item) => {
          let attr = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(attr);
        });

        /* 也可以深拷贝一层 */
        let form = {
          goods_name: this.addForm.goods_name,
          goods_cat: GoodCat,
          goods_price: this.addForm.goods_price,
          goods_number: this.addForm.goods_number,
          goods_weight: this.addForm.goods_weight,
          goods_introduce: this.addForm.goods_introduce,
          pics: this.addForm.pics,
          attrs: this.addForm.attrs,
        };
        /* 发送请求添加商品 */
        let { data: res } = await this.$http.post("goods", form);
        if (res.meta.status !== 201)
          return this.$message.error(`添加失败,${res.meta.msg}`);
        this.$message.success("添加商品成功");
        this.$refs.addForm.resetFields();
      });
    },
  },
  computed: {
    cateID() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      } else {
        return null;
      }
    },
  },
};
</script>

<style lang='less' scope>
.el-steps {
  margin: 20px 0;
}
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.ql-container {
  min-height: 300px;
}
</style>