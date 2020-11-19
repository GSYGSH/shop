<template>
    <div class="home">
        <el-button type='info' @click="clear">退出</el-button>
    </div>
</template>

<script>
export default {
    name:'Home',
    data(){
        return{

        }
    },
    methods:{
        clear(){
            /* 清除sessionStorage token */
            window.sessionStorage.removeItem('token')
            this.$router.replace('/login')
        }
    }
}
</script>

<style lang='less' scoped>

</style>