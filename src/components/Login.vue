<template>
  <div class="container">
      <div class="login-box">
          <!-- 头像部分 -->
          <div class="avatar">
              <img src="~@/assets/logo.png">
          </div>
          <!-- 验证部分 -->
          <el-form :model='loginForm' :rules='rules' label-width="0px" class="login-form" ref="loginForm">
            <el-form-item prop='username'>
            <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
            <!-- 账号/密码 -->
            </el-form-item>
            <el-form-item prop='password'>
            <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type='password'></el-input>
            </el-form-item>
            <!-- 提交/重置 -->
            <el-form-item class="form-button">
            <el-button type="primary" @click='login'>提交</el-button>
            <el-button type="info" @click="reset">重置</el-button>            
            </el-form-item>
          </el-form>
      </div>
  </div>
</template>

<script>
export default {
    name:'Login',
    data(){
        return{
            loginForm:{
                username:'admin',
                password:'123456'
            },
            rules:{
                username:[
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ]
            },
            res:{}
        }
    },
    methods:{
        reset(){
            this.$refs.loginForm.resetFields()
        },
        login(){
            this.$refs.loginForm.validate((value)=>{
                if(!value) return console.log('登陆信息校验失败'+value);
                this.$http.post('login',this.loginForm).then(({data:res})=>{
                    if(res.meta.status === 200) this.$message.success('欢迎回来')
                        this.res = res
                        console.log(this.res);

                /* 设置登陆token */
                sessionStorage.setItem('token',this.res.data.token)
                /* 跳转详情页 */
                this.$router.push('/home')                        
                },err=>{this.$message.error('登陆失败,请稍后再试')})
            })
            console.log(this.res);
        }
    }
}
</script>

<style lang='less' scoped>
.container{
    background-color: #2b4b6b;
    width: 100vw;
    height: 100vh;
    position: relative;
}
.login-box{
    width: 450px;
    height: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    border-radius: 20px;
    background-color: #fff;

    .avatar{
        width: 130px;
        height: 130px;
        padding: 10px;
        background-color: #fff;
        border: 1px solid #eee;
        box-shadow: 0 0 10px #ddd;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 1px solid #ddd;
            background-color: #eee;
        }
    }
}
.login-form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    .form-button{
        display: flex;
        justify-content: center;
    }
}
</style>