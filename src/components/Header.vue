<template>
  <div class="header">
    <div class="content">
      <div class="left">
        <RouterLink to="/">
          <div class="hc-icon">
            <img src="../assets/img/header.jpg" alt="otp"/>
          </div>
        </RouterLink>

        <el-menu
            :default-active="activeIndex"
            class="hc-el-menu"
            :ellipsis="false"
            mode="horizontal"
            background-color="#252525"
            text-color="#fff"
            active-text-color="#ffd04b"
        >
          <RouterLink to="/secret">
            <el-menu-item index="1">
              <el-icon>
                <UserFilled/>
              </el-icon>
              <span>账号密钥</span>
            </el-menu-item>
          </RouterLink>
          <RouterLink to="/server">
            <el-menu-item index="2">
              <el-icon>
                <Menu/>
              </el-icon>
              <span>接入服务</span>
            </el-menu-item>
          </RouterLink>
        </el-menu>
      </div>

      <div class="right">
        <el-menu
            class="account-el-menu"
            mode="horizontal"
            :ellipsis="false"
            background-color="#252525"
            text-color="#fff"
            active-text-color="#ffd04b"
        >
          <el-sub-menu index="10">
            <template #title>
              <img src="../assets/img/default_user.png" alt="头像"/>
            </template>
            <el-menu-item index="10-1">
              <el-icon>
                <User/>
              </el-icon>
              <span class="txt">admin</span>
            </el-menu-item>
            <el-menu-item index="10-2" @click="logoutHandler">
              <el-icon>
                <SwitchButton/>
              </el-icon>
              <span class="txt">退出登陆</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>

    </div>
  </div>
</template>


<script setup>
import {useRoute} from 'vue-router'
import {SwitchButton, User, UserFilled,} from '@element-plus/icons-vue'
import {ref, watch} from "vue";

let activeIndex = ref("1")
const currentRoute = useRoute()

watch(() => currentRoute.path, (path) => {
  switch (path) {
    case "/":
      activeIndex.value = "1"
      break
    case "/secret":
      activeIndex.value = "1"
      break
    case "/server":
      activeIndex.value = "2"
      break
  }
})


// 当前登陆账号
let currentAccount = ref({
  "user": "admin",
  "avatar": "../assets/img/default_header.png"
})

let logoutHandler = () => {
  console.log("logout")
}

</script>


<style scoped>
.header {
  width: 100%;
  height: 58px;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background: #252525;
  -webkit-box-shadow: 0px 2px 8px rgba(29, 41, 57, 0.08);
  box-shadow: 0px 2px 8px rgba(29, 41, 57, 0.08);
}

.header .content {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header .content .left, .header .content .right {
  display: flex;
  align-items: center;
}

.hc-icon img {
  height: 25px;
  vertical-align: middle;
}

.hc-el-menu {
  margin-left: 100px;
}

.header .content .right img {
  width: 30px;
  border-radius: 50%;
  margin-left: 10px;
  vertical-align: middle;
}
</style>
