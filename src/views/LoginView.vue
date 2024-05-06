<template>
  <div class="login-bg">

  </div>

  <el-dialog v-model="loginVisible"
             title="Login" width="500"
             :show-close="false"
             align-center
             :modal="false"
             style="background-color: rgba(255, 255, 255, 0.6)"
             :close-on-click-modal="false">
    <el-form :model="loginParam">
      <el-form-item label="Account" label-width="150" style="color: red">
        <el-input v-model="loginParam.account" :suffix-icon="User"/>
      </el-form-item>
      <el-form-item label="Password" label-width="150">
        <el-input v-model="loginParam.password" type="password" :suffix-icon="Key"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" plain @click="loginCommitHandler">
          Login
        </el-button>
      </div>
    </template>
  </el-dialog>

</template>

<script setup>
import {ref} from "vue";
import {Key, User} from '@element-plus/icons-vue'
import axios from "@/config/axios.config.js";
import {ElMessage} from "element-plus";

let loginVisible = ref(true)
let loginParam = ref({
  account: "admin"
})

const loginCommitHandler = () => {
  axios.post("/login", loginParam.value).then(function (response) {
    if (response.data.code === 200000) {
      ElMessage.success(response.data.msg)
    }
  })
}

</script>

<style scoped>

.login-bg {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  background-image: url('../assets/img/login_bg.jpg');
}

</style>