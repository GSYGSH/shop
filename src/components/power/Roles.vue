<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row style="padding: 0">
        <el-col>
          <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand" label="序号" width="50px">
          <template slot-scope="scope">
            <el-row
              :class="['b-border', i1 === 0 ? 't-border' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  class="vcenter"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18" class="vcenter">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      style="margin-right: 10px"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="序号" width="50px">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="editRoles(scope.row.id)"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="removeRole(scope.row.id)">删除</el-button>
            <el-button
              type="warning"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <el-form
        :model="addRolesInfo"
        label-width="80px"
        :rules="rules"
        ref="addFormRef"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc" >
          <el-input v-model="addRolesInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesClose">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="用户编辑"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editClose"
    >
      <el-form
        :model="editRolesInfo"
        label-width="80px"
        :rules="rules"
        ref="editForm"
      >
        <el-form-item label="用户ID" prop="editRoleId" :required="false">
          <el-input v-model="editRolesInfo.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="roleName" >
          <el-input v-model="editRolesInfo.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户描述" prop="roleDesc" >
          <el-input v-model="editRolesInfo.roleDesc" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesReset">取 消</el-button>
        <el-button type="primary" @click="editRolesCommit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="用户编辑"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <el-tree
        :data="rightlist"
        :props="treeProps"
        show-checkbox
        default-expand-all
        :default-checked-keys='defkey'
        ref="treeID"
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRight()"
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
      addRolesInfo: {
        roleName: "",
        roleDesc: "",
      },
      editRolesInfo: {
        roleName: "",
        roleId: "",
        roleDesc: "",
      },
      rolelist: [],
      dialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      rightlist: [],
      defkey: [],
      arrID:[],
      roleID:'',
      rules: {
        roleName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入用户描述", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      treeProps: {
        label: "authName",
        children: "children",
      },
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      let { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error("加载失败");
      this.rolelist = res.data;
      console.log(res);
    },
    addRoles() {
      /* 表单预验证 */
      this.$refs.addFormRef.validate(async value => {
        if (!value) return;
        let { data:res } = await this.$http.post("roles", this.addRolesInfo);
        if (res.meta.status !== 201) return this.$message.error("添加失败");
        this.$message.success("添加用户成功");
        this.getRoleList();
        this.dialogVisible = false;
      });
    },
    rolesClose() {
      this.dialogVisible = false;
    },
    dialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    editRolesReset() {
      this.editDialogVisible = false;
    },
    editClose() {
      this.$refs.editForm.resetFields();
    },
    async editRoles(id) {
      this.editDialogVisible = true;
      let { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) return this.$message.error("加载失败");
      this.editRolesInfo.roleId = res.data.roleId;
    },
    editRolesCommit() {
      this.editDialogVisible = true;
      /* 表单预验证 */
      this.$refs.editForm.validate(async (vaild) => {
        if (!vaild) return;
        let { data: res } = await this.$http.put(
          `roles/${this.editRolesInfo.roleId}`,
          this.editRolesInfo
        );
        if (res.meta.status !== 200) return this.$message.error("编辑失败");
        this.$message.success("编辑用户成功");
        this.getRoleList();
        this.editDialogVisible = false;
      });
    },
    async removeRightById(role, Rightid) {
      let result = await this.$confirm(
        "此操作将永远删除该文件",
        "是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") {
        return this.$message.info("已取消删除");
      }
      let { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${Rightid}`
      );
      if (res.meta.status !== 200) return this.$http.error("取消权限错误");
      role.children = res.data;
    },
    /* 展开分配权限 */
    async showSetRightDialog(role) {
      /* 清空权限数组 */
      this.defkey = []
      this.roleID = role.id

      this.setRightDialogVisible = true;
      let { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) return this.$message.error("获取数据失败");
      this.rightlist = res.data;
      this.getLeafKeys(role, this.defkey);
    },
    /* 递归获取三级id */
    getLeafKeys(node, arr) {
      if (!node.children) {
        /* 将三级id赋值给数组 */
        return this.defkey.push(node.id);
      } else {
        node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
        });
      }
    },
    /* 分配权限 */
   async setRight(){
     this.arrID = []
      this.arrID.push(...this.$refs.treeID.getCheckedKeys(),...this.$refs.treeID.getHalfCheckedKeys())

      let idStr = this.arrID.join(',')
      
     let {data:res} = await this.$http.post(`roles/${this.roleID}/rights`,{rids:idStr})

     if(res.meta.status !== 200) return this.$message.error('更新权限失败')
     this.$message.success('更新权限成功')
     this.getRoleList()
     this.setRightDialogVisible = false
      
    },
   async removeRole(id){
      let confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          
        }).catch(err=>err)

      if(confirm !== 'confirm') return this.$message.info('已取消删除')
      let {data:res} = await this.$http.delete(`roles/${id}`)
      if(res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  },
};
</script>

<style lang='less' scoped>
.el-table {
  margin-top: 15px;
}
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-row {
  padding: 5px;
}
.el-tag{
  margin-top: 5px;
  margin-bottom: 5px;
}
.t-border {
  border-top: 1px solid #eee;
}
.b-border {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
  flex-flow: wrap;

}
</style>