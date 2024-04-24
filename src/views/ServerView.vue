<template>
  <el-card class="box-card" :style="autoHeight">
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
      <el-table-column prop="serverSign" label="服务标识"/>
      <el-table-column prop="serverName" label="服务名称"/>
      <el-table-column prop="serverRemark" label="服务描述"/>
      <el-table-column prop="isEnable" label="服务状态" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.isEnable === 1 ? 'success' : 'danger'">
            {{ isEnableFormatter(scope.row.isEnable) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isOperateSensitiveData" label="操作敏感信息">
        <template #default="scope">
          <el-tag :type="scope.row.isOperateSensitiveData === 1 ? 'success' : 'danger'">
            {{ isSensitiveFormatter(scope.row.isOperateSensitiveData) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isEnableIPlist" label="IP白名单" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.isEnableIPlist === 1 ? 'success' : 'danger'">
            {{ isEnableFormatter(scope.row.isEnableIPlist) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :formatter="dateFormatter" label="创建时间" width="165"/>
      <el-table-column prop="updateTime" :formatter="dateFormatter" label="更新时间" width="165"/>
      <el-table-column label="操作" width="330">
        <template #default="scope">
          <el-button plain type="primary" size="small" @click="editBtnHandler(scope.row)">
            编辑
          </el-button>
          <el-button plain type="success" size="small" @click="ipListBtnHandler(scope.row)">
            IP白名单
          </el-button>
          <el-button plain type="warning" size="small" @click="viewSecretHandler(scope.row)">
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
      v-model="addServerDialogVisible"
      title="新增接入服务"
      width="50%"
      center
      draggable
  >
    <el-form :model="addServerParam" label-width="200px">
      <el-form-item label="服务标识">
        <el-input v-model="addServerParam.serverSign" clearable/>
      </el-form-item>
      <el-form-item label="服务名称">
        <el-input v-model="addServerParam.serverName" clearable/>
      </el-form-item>
      <el-form-item label="服务描述">
        <el-input v-model="addServerParam.serverRemark" clearable/>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="addServerParam.isEnable" inline-prompt
                   active-text="启用"
                   inactive-text="禁用"/>
      </el-form-item>
      <el-form-item label="操作敏感消息">
        <el-switch v-model="addServerParam.isOperateSensitiveData" inline-prompt
                   active-text="允许"
                   inactive-text="禁止"/>
      </el-form-item>
      <el-form-item label="IP白名单">
        <el-switch v-model="addServerParam.isEnableIPlist" inline-prompt
                   active-text="启用"
                   inactive-text="禁用"/>
      </el-form-item>
    </el-form>
    <template #footer>
          <span class="dialog-footer">
            <el-button @click="addServerDialogVisible = false">取消</el-button>
            <el-button type="warning" plain @click="addServerCommitHandler">
              确定
            </el-button>
          </span>
    </template>
  </el-dialog>

  <el-dialog
      v-model="viewServerDialogVisible"
      title="查看服务密钥"
      width="600px"
      center
      draggable
  >
    <el-form :model="curSelectServer" label-width="100px">
      <el-form-item label="服务标识">
        <el-input v-model="curSelectServer.serverSign"/>
      </el-form-item>
      <el-form-item label="密钥">
        <el-input v-model="curSelectServer.serverSecret"/>
      </el-form-item>
      <el-form-item label="IV">
        <el-input v-model="curSelectServer.iv"/>
      </el-form-item>
    </el-form>
    <template #footer>
          <span class="dialog-footer">
            <el-button @click="viewServerDialogVisible = false">关闭</el-button>
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
    <el-form :model="curSetEnableSelectServer" label-width="100px">
      <el-form-item label="服务标识">
        <el-input v-model="curSetEnableSelectServer.serverSign" disabled clearable/>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="curSetEnableSelectServer.isEnable" inline-prompt
                   active-text="启用"
                   inactive-text="禁用"/>
      </el-form-item>
      <el-form-item label="操作敏感信息">
        <el-switch v-model="curSetEnableSelectServer.isOperateSensitiveData" inline-prompt
                   active-text="允许"
                   inactive-text="禁止"/>
      </el-form-item>
      <el-form-item label="IP白名单">
        <el-switch v-model="curSetEnableSelectServer.isEnableIPlist" inline-prompt
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

  <el-dialog
      v-model="editDialogVisible"
      title="修改基础信息"
      width="600px"
      center
      draggable
  >
    <el-form :model="curEditSelectServer" label-width="100px">
      <el-form-item label="服务标识">
        <el-input v-model="curEditSelectServer.serverSign" disabled/>
      </el-form-item>
      <el-form-item label="服务名称">
        <el-input v-model="curEditSelectServer.serverName"/>
      </el-form-item>
      <el-form-item label="服务描述">
        <el-input v-model="curEditSelectServer.serverRemark"/>
      </el-form-item>
    </el-form>
    <template #footer>
          <span class="dialog-footer">
            <el-button @click="editDialogVisible = false">取消</el-button>
            <el-button type="warning" plain @click="editCommitHandler">
              确定修改
            </el-button>
          </span>
    </template>
  </el-dialog>

  <el-dialog
      v-model="ipListDialogVisible"
      width="800px"
      draggable
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="server-dialog-header">
        <b>{{ '[' + curSelectServer.serverSign + '] IP白名单列表' }}</b>
        <el-button plain type="primary" size="small" @click="addIpListBtnHandler">
          增加
        </el-button>
      </div>
    </template>

    <el-table :data="curIpListTableData" style="width: 100%">
      <el-table-column prop="serverSign" label="服务标识"/>
      <el-table-column prop="ip" label="IP"/>
      <el-table-column prop="createTime" :formatter="dateFormatter" label="添加时间"/>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button plain type="danger" size="small" @click="removeIpBtnHandler(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
          <span class="dialog-footer">
            <el-button @click="ipListDialogVisible = false">关闭</el-button>
          </span>
    </template>
  </el-dialog>

  <el-dialog
      v-model="addIpListDialogVisible"
      :title="'新增 [' + curSelectServer.serverSign + '] IP白名单列表'"
      width="600px"
      center
      draggable
  >
    <el-form :model="addIpListParam" label-width="100px">
      <el-form-item label="服务标识">
        <el-input v-model="addIpListParam.serverSign" disabled clearable/>
      </el-form-item>
      <el-form-item label="IP">
        <el-input v-model="addIpListParam.ip" clearable/>
      </el-form-item>
    </el-form>
    <template #footer>
          <span class="dialog-footer">
            <el-button @click="addIpListDialogVisible = false">取消</el-button>
            <el-button type="warning" plain @click="addIpListCommitHandler">
              确定增加
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
import {ElMessage} from "element-plus";

let loading = ref(false)
let tableData = ref([])
let pageNo = ref(1)
let pageSize = ref(10)
let total = ref(0)
let searchTxt = ref("")
let addServerDialogVisible = ref(false)
let addServerParam = ref({"isEnable": true, "isOperateSensitiveData": false, "isEnableIPlist": false})
let windowHeight = window.innerHeight
let autoHeight = ref({
  height: ''
})

let curSelectServer = ref({})
let viewServerDialogVisible = ref(false)

let curSetEnableSelectServer = ref({})
let setEnableDialogVisible = ref(false)

let curEditSelectServer = ref({})
let editDialogVisible = ref(false)

let ipListDialogVisible = ref(false)
let curIpListTableData = ref([])
let addIpListDialogVisible = ref(false)
let addIpListParam = ref({})


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

const dateFormatter = (row, column, cellValue) => {
  return dayjs(cellValue).format("YYYY-MM-DD HH:mm:ss")
}

const addServerCommitHandler = () => {
  const param = addServerParam.value
  if (!param || !param.serverSign || !param.serverName) {
    ElMessage.error("缺失参数(服务标识|服务名称)")
    return
  }
  axios.post("/server", {
    "serverSign": param.serverSign,
    "serverName": param.serverName,
    "serverRemark": param.serverRemark,
    "isEnable": param.isEnable ? 1 : 2,
    "isOperateSensitiveData": param.isOperateSensitiveData ? 1 : 2,
    "isEnableIPlist": param.isEnableIPlist ? 1 : 2,
  }).then(function (response) {
    addServerDialogVisible.value = false
    paging()
    ElMessage.success(response.data.msg)
  })
}

const paging = () => {
  axios.get("/server/paging", {
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

const isEnableFormatter = (cellValue) => {
  if (cellValue === 1) {
    return "启用"
  } else if (cellValue === 2) {
    return "禁用"
  } else {
    return cellValue
  }
}

const isSensitiveFormatter = (cellValue) => {
  if (cellValue === 1) {
    return "允许"
  } else if (cellValue === 2) {
    return "禁止"
  } else {
    return cellValue
  }
}

const editBtnHandler = (row) => {
  curEditSelectServer = ref({
    "id": row.id,
    "serverSign": row.serverSign,
    "serverName": row.serverName,
    "serverRemark": row.serverRemark,
  })
  editDialogVisible.value = true
}

const editCommitHandler = () => {
  let params = curEditSelectServer.value
  axios.put("/server/base", {
    "id": params.id,
    "serverSign": params.serverSign,
    "serverName": params.serverName,
    "serverRemark": params.serverRemark,
  }).then(function (response) {
    editDialogVisible.value = false
    paging()
    ElMessage.success(response.data.msg)
  })
}

const viewSecretHandler = (row) => {
  axios.get("/server/" + row.serverSign).then(function (response) {
    curSelectServer.value = response.data.data
    viewServerDialogVisible.value = true
  })
}

const setEnableBtnHandler = (row) => {
  curSetEnableSelectServer = ref({
    "id": row.id,
    "serverSign": row.serverSign,
    "serverName": row.serverName,
    "isEnable": row.isEnable === 1,
    "isOperateSensitiveData": row.isOperateSensitiveData === 1,
    "isEnableIPlist": row.isEnableIPlist === 1
  })
  setEnableDialogVisible.value = true
}

const setEnableCommitHandler = () => {
  let params = curSetEnableSelectServer.value
  axios.put("/server/enable", {
    "id": params.id,
    "serverSign": params.serverSign,
    "serverName": params.serverName,
    "isEnable": params.isEnable ? 1 : 2,
    "isOperateSensitiveData": params.isOperateSensitiveData ? 1 : 2,
    "isEnableIPlist": params.isEnableIPlist ? 1 : 2,
  }).then(function (response) {
    setEnableDialogVisible.value = false
    paging()
    ElMessage.success(response.data.msg)
  })
}

const getIpList = (serverSign) => {
  axios.get("/server/" + serverSign + "/iplist").then(function (response) {
    curIpListTableData.value = response.data.data
  })
}

const ipListBtnHandler = (row) => {
  axios.get("/server/" + row.serverSign).then(function (response) {
    curSelectServer.value = response.data.data
    getIpList(curSelectServer.value.serverSign)
    ipListDialogVisible.value = true
  })
}

const removeIpBtnHandler = (row) => {
  axios.delete("/server/iplist", {data: row}).then(function (response) {
    ElMessage.success(response.data.msg)
    getIpList(row.serverSign)
  })
}

const addIpListBtnHandler = () => {
  const sign = curSelectServer.value.serverSign
  addIpListParam.value = {
    serverSign: sign,
    ip: ""
  }
  addIpListDialogVisible.value = true
}

const addIpListCommitHandler = () => {
  axios.post("/server/iplist", addIpListParam.value).then(function (response) {
    ElMessage.success(response.data.msg)
    addIpListDialogVisible.value = false
    getIpList(addIpListParam.value.serverSign)
  })
}

</script>

<style scoped>
.search {
  width: 400px;
}

.server-dialog-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
}
</style>


