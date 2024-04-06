<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-input
            v-model="searchTxt"
            placeholder="搜索服务标识"
            class="search"
            size="large"
            style="width: 260px"
            :suffix-icon="Search"
            clearable
            @keydown.enter="searchHandler"
            @keydown.esc="clearSearchTxt"
        >
        </el-input>
        <el-button color="#337ecc" plain style="margin-left:20px;" @click="addServerDialogVisible = true">
          新增服务
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
      <el-table-column prop="f6" :formatter="dateFormatter" label="创建时间" width="170"/>
      <el-table-column prop="createTime" :formatter="dateFormatter" label="更新时间" width="170"/>
      <el-table-column prop="updateTime" :formatter="dateFormatter" label="操作" width="100"/>
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
      v-model="addServerDialogVisible"
      title="新增接入服务"
      width="50%"
      center
      draggable
  >
    <el-form :model="addServerParam" label-width="200px">
      <el-form-item label="服务标识">
        <el-input v-model="addServerParam.alias" clearable/>
      </el-form-item>
      <el-form-item label="服务名称">
        <el-input v-model="addServerParam.serverPwd" type="password" clearable/>
      </el-form-item>
      <el-form-item label="服务描述">
        <el-input v-model="addServerParam.serverPwd" type="password" clearable/>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="addServerParam.isEnable" inline-prompt
                   active-text="启用"
                   inactive-text="禁用"/>
      </el-form-item>
      <el-form-item label="操作敏感消息">
        <el-switch v-model="addServerParam.isSensitive" inline-prompt
                   active-text="允许"
                   inactive-text="禁止"/>
      </el-form-item>
    </el-form>
    <template #footer>
          <span class="dialog-footer">
            <el-button @click="addServerDialogVisible = false">取消</el-button>
            <el-button color="#337ecc" plain @click="addServerCommitHandler">
              确定
            </el-button>
          </span>
    </template>
  </el-dialog>


</template>


<script setup>
import axios from "@/config/axios.config.js";
import {ref} from "vue";
import dayjs from "dayjs"
import {Search} from "@element-plus/icons-vue";

let loading = ref(false)
let tableData = ref([])
let pageNo = ref(1)
let pageSize = ref(10)
let total = ref(0)
let searchTxt = ref("")
let addServerDialogVisible = ref(false)
let addServerParam = ref([])

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

const addServerCommitHandler = () => {
  console.log("addServerCommitHandler")
}

</script>

<style scoped>
.search {
  width: 400px;
}
</style>


