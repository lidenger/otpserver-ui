<template>
  <el-card class="box-card" :style="autoHeight">
    <template #header>
      <div class="card-header">
        <el-input
            v-model="searchTxt"
            placeholder="搜索账号"
            class="search"
            size="large"
            style="width: 260px"
            :suffix-icon="Search"
            clearable
            @keydown.enter="searchHandler"
            @keydown.esc="clearSearchTxt"
        >
        </el-input>
        <el-button color="#337ecc" plain style="margin-left:20px;" @click="addAccountDialogVisible = true">
          新增账号密钥
        </el-button>
      </div>
    </template>
    <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="Loading..."
        style="width: 100%" stripe>
      <el-table-column prop="id" fixed label="ID" min-width="60"/>
      <el-table-column prop="f1" label="服务标识"/>
      <el-table-column prop="f2" label="服务名称"/>
      <el-table-column prop="f3" label="服务描述"/>
      <el-table-column prop="f4" label="是否启用"/>
      <el-table-column prop="f5" label="敏感信息"/>
      <el-table-column prop="createTime" :formatter="dateFormatter" label="创建时间" width="170"/>
      <el-table-column prop="updateTime" :formatter="dateFormatter" label="更新时间" width="170"/>
      <el-table-column label="操作" width="100"/>
    </el-table>
    <el-pagination
        style="margin-top:10px;float:right;"
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[5,10,30,100]"
        layout="total,prev,pager,next,sizes"
        :total="total"
        @size-change="pageSizeChangeHandler"
        @current-change="pageNoChangeHandler"
    />
  </el-card>

  <el-dialog
      v-model="addAccountDialogVisible"
      title="增加账号密钥"
      width="50%"
      center
      draggable
  >
    <el-form :model="addAccountParam" label-width="200px">
      <el-form-item label="账号">
        <el-input v-model="addAccountParam.account" clearable/>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="addAccountParam.isEnable" inline-prompt
                   active-text="启用"
                   inactive-text="禁用"/>
      </el-form-item>
    </el-form>
    <template #footer>
          <span class="dialog-footer">
            <el-button @click="addAccountDialogVisible = false">取消</el-button>
            <el-button color="#337ecc" plain @click="addAccountCommitHandler">
              确定
            </el-button>
          </span>
    </template>
  </el-dialog>


</template>


<script setup>
import axios from "@/config/axios.config.js";
import {onMounted, ref} from "vue";
import dayjs from "dayjs"
import {Search} from "@element-plus/icons-vue";
import {ElMessage} from 'element-plus'

let loading = ref(false)
let tableData = ref([])
let pageNo = ref(1)
let pageSize = ref(10)
let total = ref(0)
let searchTxt = ref("")
let addAccountDialogVisible = ref(false)
let addAccountParam = ref([])
let windowHeight = parseInt(window.innerHeight)
let autoHeight = ref({
  height: ''
})
onMounted(() => {
  autoHeight.value.height = (windowHeight - 108) + 'px';
})

const searchHandler = () => {
  console.log("searchHandler")
}
const clearSearchTxt = () => {
  searchTxt.value = ""
  console.log("clearSearchTxt")
}
const pageSizeChangeHandler = () => {
  console.log("pageSizeChangeHandler")
}
const pageNoChangeHandler = () => {
  console.log("pageNoChangeHandler")
}

const dateFormatter = (row, column, cellValue) => {
  return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
}

const addAccountCommitHandler = () => {
  const param = addAccountParam.value
  if (!param || !param.account) {
    ElMessage.error("缺失参数")
    return
  }
  axios.post("/secret", {
    "account": param.account,
    "isEnable": param.isEnable ? 1 : 2
  }).then(function (response) {
    console.log(response);
  }).catch(function (error) {
    console.log(error);
  });
}

</script>

<style scoped>
.search {
  width: 400px;
}
</style>


