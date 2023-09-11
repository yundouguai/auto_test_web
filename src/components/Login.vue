<template>
    <div class="centered-container">
        <el-form>
            <el-form-item label="用户名" label-width="100px" :required="true">
                <el-input v-model="username" />
            </el-form-item>
            <el-form-item label="密码" label-width="100px" :required="true">
                <el-input v-model="password" />
            </el-form-item>
        </el-form>
    </div>
    <div class="centered-container">
        <el-button type="primary" @click="login" style="align-content: center;" :loading="loadingPost">登录</el-button>
    </div>
</template>
   
<script>

import { ref, toRaw } from "vue";
import { ElNotification } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useStore } from "vuex";

export default {
    name: "MyLogin",

    props: {
        'uiTempId': Number,
        'uiTempName': String,
        'projectName': String,
        'uiTempValue': String,
    },

    setup() {
        const myStore = useStore();
        const username = ref('');
        const password = ref('');
        const loadingPost = ref(false);

        const init = () => {
            // 初始化逻辑
        };

        // 返回需要暴露给模板的数据和方法
        return {
            username,
            password,
            loadingPost,
            init,
            myStore: ref(myStore) // 将myStore包装成ref以便在methods中访问
        };
    },


    methods: {
        // 提交数据
        async login() {
            if (this.username.length <1 || this.password.length <1){
                ElMessage.error("不可为空")
                return
            }
            this.loadingPost = true
            const self = this
            await this.$http({
                    url: '/token',
                    method: 'POST',
                    data: {
                        username: this.username,
                        password: this.password,
                    },
                    headers: {
                        'content-type': "application/x-www-form-urlencoded"
                    }
                }).then(
                    function (response) {
                        if (response.status == 200) {
                            localStorage.setItem('token',response.data.access_token)
                            self.myStore.commit('setTokenExpired', false); // 关闭登录弹窗
                            ElMessage.success('登录成功')
                        }
                    }

            ).catch(
                function (error) {
                    console.log(error)
                    ElMessage.error(error.response.data.message)
                }
            )
            this.loadingPost = false
        },
    },


};
</script>
   
<style scoped>
.centered-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
  background-size: 100%;
  padding: 10px;
}
.white-bold-label {
  font-weight: bold; /* 设置加粗字体 */
}

</style>