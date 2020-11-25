<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 一行两列 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索栏 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUserInfo">添加用户</el-button>
        </el-col>
      </el-row>
      <!--  表格区域 -->
      <el-table :data="userlist" stripe border>
        <!-- 每一列的数据 -->
        <el-table-column
          type="index"
          label="序号"
          width="50px"
        ></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 用户状态 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ddd"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
          <!-- 用户操作 -->
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope" class="button-slot">
            <!-- 编辑用户 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除用户 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
            <!-- 配置用户 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--  分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <el-form
        :model="newUserInfo"
        label-width="80px"
        :rules="rules"
        ref="addFormRef"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="newUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="newUserInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="newUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="newUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="userClose">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
      title="用户编辑"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form :model='editForm' label-width='80px' :rules='rules' ref="editForm">
        <el-form-item label='用户名' prop='editUsername'>
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label='号码' prop='mobile'>
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserReset">取 消</el-button>
        <el-button type="primary" @click="editUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
        <el-dialog
      title="用户编辑"
      :visible.sync="setRoleDialogVisible"
      width="50%"
    >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色:
          <el-select v-model="selectedRoleId" placeholder='请选择'>
            <el-option v-for="item in roleList" :key="item.id" :label='item.roleName' :value='item.id'> 
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Users",
  data() {
    /* 自定义验证邮箱 */
    let checkEmail = (rule, value, callback) => {
      const reg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
      if (reg.test(value)) {
        return callback();
      }
      return callback(new Error("请输入合法的邮箱"));
    };
    /* 自定义验证手机号 */
    let checkMobile = (rule, value, callback) => {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (reg.test(value)) {
        return callback();
      }
      return callback(new Error("请输入合法手机号"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1, //当前页
        pagesize: 10, //当前页有几个数据
      },
      userlist: [],
      total: 0,
      dialogVisible: false, //控制添加用户对话框显示
      newUserInfo: {
        //新表单用户信息
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      rules: {
        editUsername:[
          {  message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },          
        ],
        username: [
          //名字验证规则
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        password: [
          //密码验证规则
          { required: false, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          //邮箱验证规则
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          //手机验证规则
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editDialogVisible:false,
      setRoleDialogVisible:false,
      roleList:[],
      userInfo:{},
      selectedRoleId:'',
      editForm:{
        userid:'',
        username:'',
        email:'',
        mobile:''
      }
    };
  },
  methods: {
    /* 获取User数据 */
    async getUserList() {
      let { data: res } = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      if (res.meta.status != 200) return this.$message.error("请求Users失败");
      console.log(res);
      this.userlist = res.data.users;
      this.total = res.data.total;
    },
    /* 监听页码大小(页面数据条数改变 )*/
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    /* 监听当前页改变 */
    handleCurrentChange(current) {
      console.log(current);
      this.queryInfo.pagenum = current;
      this.getUserList();
    },
    /* 监听用户状态变化 */
    async userStateChanged(row) {
      let { data: res } = await this.$http.put(
        `users/${row.id}/state/${row.mg_state}`
      );
      if (res.meta.status !== 200) {
        this.row.mg_state = !this.row.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      console.log(res);
      this.$message.success("更新用户状态成功");
    },
    /* 添加用户信息 */
    addUserInfo() {
      this.dialogVisible = true;
    },
    /* 确认添加用户,并预校验 */
    addUser() {
      /* 预校验 */
      this.$refs.addFormRef.validate(async (vaild) => {
        if (!vaild) return;
        /* 校验成功添加数据 */
        let { data: res } = await this.$http.post("users", this.newUserInfo);
        if (res.meta.status !== 201) {
          this.$message.error("请求添加失败");
        } else {
          this.$message.success("添加用户成功");
        }
        //关闭对话框
        this.dialogVisible = false;
        //更新数据
        this.getUserList();
      });
    },
    /* 关闭添加用户框重置数据 */
    userClose() {
      this.dialogVisible = false;
    },
    dialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    /* 展示编辑用户对话框 */
    async showEditDialog(id) {
      this.editDialogVisible = true
      let {data:res} = await this.$http.get(`users/${id}`)
      console.log(res);
      if(res.meta.status !== 200) return this.$message.error('获取用户信息失败')
      this.editForm.userid = id
      this.editForm.username = res.data.username   
      console.log(res,this.editForm);
    },
    /* 编辑用户重置 */
    editUserReset(){
      this.$refs.editForm.resetFields()
      this.editDialogVisible=false
    },
    /* 编辑用户校验和提交 */
    editUser(){
      this.$refs.editForm.validate(async vaild=>{
        /* 预校验 */
        if(!vaild) return ;
        let {data:res} = await this.$http.put('users/' + this.editForm.userid,this.editForm)
        if(res.meta.status !== 200) return this.$message.error('更改失败')
        this.$message.success('更改成功')
        /* 更新状态 */
        this.getUserList()
        this.editDialogVisible = false;
      })
    },
    async removeUser(id){
      let result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(result !== 'confirm'){
          return this.$message.info('已取消删除');    
        }else{
          this.$http.delete(`users/${id}`).then(({data:res})=>{
            if(res.meta.status === 200){
              this.$message.success('删除成功')
              this.getUserList()
            }else{
              this.$message.error('删除失败')
            }
          }).catch(err=>console.log(err))
        }
    },
    /* 分配角色对话框 */
    async setRole(role){
      /* 展示之前获取所有角色列表 */
      let {data:res} = await this.$http.get(`roles`)
      console.log(res);
      if(res.meta.status !== 200)return this.$message.error('获取id失败')
      this.roleList = res.data
      this.userInfo = role
      this.setRoleDialogVisible = true
    },
    /* 点击按钮，分配角色 */
    async saveRoleInfo(){
      if(!this.selectedRoleId){
        return this.$message.error('请选择分配的角色')
      }
      let {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{
        rid:this.selectedRoleId
      })
      if(res.meta.status !== 200) return this.$message.error('分配错误')

      this.getUserList()
      this.$message.success('分配角色成功')
      this.setRoleDialogVisible = false
    }
  },
  created() {
    this.getUserList();
  },
};
</script>

<style lang='less' scoped>
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
</style>