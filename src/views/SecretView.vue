<template>
  <el-card class="box-card" :style="autoHeight">
    <template #header>
      <div class="card-header">
        <el-input
            v-model="searchTxt"
            placeholder="搜索账号 | 启用 | 禁用"
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
      <el-table-column prop="id" fixed label="ID" min-width="30"/>
      <el-table-column prop="account"  label="账号"/>
      <el-table-column prop="isEnable" label="是否启用">
        <template #default="scope">
          <el-tag :type="scope.row.isEnable === 1 ? 'success' : 'danger'">
            {{ isEnableFormatter(scope.row.isEnable) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="dataCheck" label="数据校验" width="300" :show-overflow-tooltip="true"/>
      <el-table-column prop="createTime" :formatter="dateFormatter" label="创建时间" width="170"/>
      <el-table-column prop="updateTime" :formatter="dateFormatter" label="更新时间" width="170"/>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button plain type="primary" size="small" @click="viewSecretHandler(scope.row)">
            查看密钥
          </el-button>
          <el-button type="warning" plain size="small" @click="setEnableBtnHandler(scope.row)">
            启用/禁用
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        style="margin-top:10px;float:right;"
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :page-sizes="[5,10,30,100]"
        layout="total,prev,pager,next,sizes"
        :total="total"
        @size-change="pagingChangeHandler"
        @current-change="pagingChangeHandler"
    />
  </el-card>

  <el-dialog
      v-model="addAccountDialogVisible"
      title="新增账号密钥"
      width="600px"
      center
      draggable
  >
    <el-form :model="addAccountParam" label-width="100px">
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

  <el-dialog
      v-model="viewSecretDialogVisible"
      title="查看账号密钥"
      width="600px"
      center
      draggable
  >
    <el-form :model="curSelectAccount" label-width="100px">
      <el-form-item label="账号">
        <el-input v-model="curSelectAccount.account" clearable/>
      </el-form-item>
      <el-form-item label="密钥">
        <el-input v-model="curSelectAccount.secret" type="textarea"/>
      </el-form-item>
    </el-form>
    <template #footer>
          <span class="dialog-footer">
            <el-button @click="viewSecretDialogVisible = false">关闭</el-button>
          </span>
    </template>
  </el-dialog>

  <el-dialog
      v-model="setEnableDialogVisible"
      title="启用/禁用"
      width="600px"
      center
      draggable
  >
    <el-form :model="curSetEnableSelectAccount" label-width="100px">
      <el-form-item label="账号">
        <el-input v-model="curSetEnableSelectAccount.account" disabled clearable/>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="curSetEnableSelectAccount.isEnable" inline-prompt
                   active-text="启用"
                   inactive-text="禁用"/>
      </el-form-item>
    </el-form>
    <template #footer>
          <span class="dialog-footer">
            <el-button @click="setEnableDialogVisible = false">取消</el-button>
            <el-button type="warning" plain @click="setEnableCommitHandler">
              确定修改
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

let curSelectAccount = ref({})
let viewSecretDialogVisible = ref(false)

let curSetEnableSelectAccount = ref({})
let setEnableDialogVisible = ref(false)


onMounted(() => {
  autoHeight.value.height = (windowHeight - 108) + 'px';
})

const searchHandler = () => {
  paging()
}
const clearSearchTxt = () => {
  searchTxt.value = ""
  paging()
}
const pagingChangeHandler = () => {
  paging()
}

const paging = () => {
  axios.get("/secret/paging", {
    params: {
      "pageNo": pageNo.value,
      "pageSize": pageSize.value,
      "searchTxt": searchTxt.value
    }
  }).then(function (response) {
    let data = response.data.data
    tableData.value = data.rows
    total.value = data.total
  })
}
paging()

const viewSecretHandler = (row) => {
  axios.get("/secret/" + row.account).then(function (response) {
    curSelectAccount.value = response.data.data
    viewSecretDialogVisible.value = true
  })
}

const dateFormatter = (row, column, cellValue) => {
  return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
}

const isEnableFormatter = (cellValue) => {
  if (cellValue === 1) {
    return "启用"
  } else if (cellValue === 2) {
    return "禁用"
  } else {
    return cellValue
  }
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
    addAccountDialogVisible.value = false
    paging()
    ElMessage.success(response.data.msg)
  })
}

const setEnableBtnHandler = (row) => {
  curSetEnableSelectAccount = ref({
    "id": row.id,
    "account": row.account,
    "isEnable": row.isEnable === 1
  })
  setEnableDialogVisible.value = true
}

const setEnableCommitHandler = () => {
  let params = curSetEnableSelectAccount.value
    axios.put("/secret/enable", {
      "id": params.id,
      "account": params.account,
      "isEnable": params.isEnable ? 1 : 2
    }).then(function (response) {
      setEnableDialogVisible.value = false
      paging()
      ElMessage.success(response.data.msg)
    })
}

</script>

<style scoped>
.search {
  width: 400px;
}
</style>


