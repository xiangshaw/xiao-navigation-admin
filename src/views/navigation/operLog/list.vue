<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="模块标题">
              <el-input v-model="searchObj.title" style="width: 100%" placeholder="模块标题">
                <i slot="prefix" class="el-input__icon el-icon-search" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button class="btn-add" size="mini" @click="batchRemove()">批量删除</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ textAlign: 'center' }"
      @selection-change="handleSelectionChange"
    >
      <!-- 复选框 handleSelectionChange触发方法-->
      <el-table-column type="selection" />
      <el-table-column
        fixed
        label="序号"
        width="70"
        align="center"
      >
        <template #default="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="模块标题" width="105px"/>
      <!--  0其他 1新增 2修改 3删除    -->
      <el-table-column prop="businessType" label="业务类型" width="90px">
        <template #default="scope">
          <el-tag :style="{ backgroundColor: businessTypeTagType(scope.row.businessType) }" effect="dark">
            {{ businessTypeTagText(scope.row.businessType) }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="method" label="方法名称"/>-->
      <el-table-column prop="requestMethod" label="请求方式" width="90px">
        <template #default="scope">
          <el-tag :style="{ backgroundColor: requestMethodType(scope.row.requestMethod) }" effect="dark">
            {{ requestMethodText(scope.row.requestMethod) }}
          </el-tag>
        </template>
      </el-table-column>
      <!--  0其他 1后台用户 2手机端用户    -->
      <el-table-column prop="operatorType" label="操作类别" width="90px">
        <template #default="scope">
          <el-tag :style="{ backgroundColor: operatorTypeType(scope.row.operatorType) }" effect="dark">
            {{ operatorTypeText(scope.row.operatorType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operName" label="操作人员" />
      <el-table-column prop="operUrl" fit label="请求URL" show-overflow-tooltip />
      <el-table-column prop="operIp" label="主机地址" />
      <!--<el-table-column prop="operParam" label="请求参数"/>
      <el-table-column prop="jsonResult" label="返回参数"/>-->
      <!--   0成功 1失败   -->
      <el-table-column prop="status" label="操作状态">
        <template #default="scope">
          <el-tag :style="{ backgroundColor: statusType(scope.row.status) }" effect="dark">
            {{ statusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="errorMsg" label="错误消息" show-overflow-tooltip />
      <el-table-column prop="createTime" label="时间" :formatter="dateFormat" width="160" />
      <el-table-column label="操作" fixed="right" width="200" align="center">
        <template #default="scope">
          <el-button type="primary" icon="el-icon-more" size="mini" title="详情" @click="getById(scope.row.id)" />
          <!-- scope.row.id 得到整个表.所有行.id -->
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeDataById(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center;"
      :page-sizes="[5, 10, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChange"
      @current-change="fetchData"
    />
    <!-- 查看详情 弹窗 -->
    <!-- title弹窗名称  :visible.sync控制打开关闭  :destroy-on-close弹窗右侧显示X   -->
    <el-dialog title="日志详情" :visible.sync="dialogVisible" :destroy-on-close="true" append-to-body width="45%">
      <el-form :inline="true" :model="operLogForm" label-width="150px" size="small" style="padding-right: 40px;">
        <el-input v-model="operLogForm.id" placeholder="ID">
          <template #prepend disabled="inline-block">日志 &nbsp; - ID</template>
        </el-input>
        <el-input v-model="operLogForm.title">
          <template #prepend>模块标题</template>
        </el-input>
        <!--  0其他 1新增 2修改 3删除    -->
        <el-input v-model="operLogForm.businessType">
          <template #prepend>业务类型</template>
        </el-input>
        <el-input v-model="operLogForm.method">
          <template #prepend>方法名称</template>
        </el-input>
        <el-input v-model="operLogForm.requestMethod">
          <template #prepend>请求方式</template>
        </el-input>
        <!--  0其他 1后台用户 2手机端用户    -->
        <el-input v-model="operLogForm.operatorType">
          <template #prepend>操作类别</template>
        </el-input>
        <el-input v-model="operLogForm.operName">
          <template #prepend>操作人员</template>
        </el-input>
        <!-- <el-input v-model="operLogForm.deptName">
          <template #prepend>所属部门</template>
        </el-input>-->
        <el-input v-model="operLogForm.operUrl">
          <template #prepend>请求URL</template>
        </el-input>
        <el-input v-model="operLogForm.operIp">
          <template #prepend>主机地址</template>
        </el-input>
        <el-input disabled placeholder="↓"><template #prepend>请求参数</template></el-input>
        <el-input v-model="operLogForm.operParam" type="textarea" autosize />
        <el-input disabled placeholder="↓"><template #prepend>返回参数</template></el-input>
        <el-input v-model="operLogForm.jsonResult" type="textarea" autosize />
        <!--   0正常 1异常   -->
        <el-input v-model="operLogForm.status === false ? '成功' : operLogForm.status === true ? '失败' : ''">
          <template #prepend>操作状态</template>
        </el-input>
        <el-input disabled placeholder="↓"><template #prepend>错误消息</template></el-input>
        <el-input v-model="operLogForm.errorMsg" type="textarea" autosize />
        <el-input v-model="operLogForm.operTime" autocomplete="off" :formatter="dateFormat">
          <i slot="prefix" class="el-input__icon el-icon-date" />
          <template #prepend>操作时间</template>
        </el-input>
        <!--     style="width: auto"   -->
        <el-input v-model="operLogForm.createTime" autocomplete="off" :formatter="dateFormat">
          <i slot="prefix" class="el-input__icon el-icon-date" />
          <template #prepend>创建时间</template>
        </el-input>
        <el-input v-model="operLogForm.updateTime" autocomplete="off" :formatter="dateFormat">
          <i slot="prefix" class="el-input__icon el-icon-date" />
          <template #prepend>更新时间</template>
        </el-input>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 引入定义接口的js文件
import api from '@/api/navigation/operLog'
import { commonTypes, requestMethods, operatorTypes, statuses } from '@/constants/commonTypes'
const defaultForm = {
  id: '',
  title: '',
  businessType: '',
  method: '',
  requestMethod: '',
  operatorType: '',
  operName: '',
  deptName: '',
  operUrl: '',
  operIp: '',
  operParam: '',
  jsonResult: '',
  status: false,
  errorMsg: '',
  operTime: '',
  createTime: '',
  updateTime: ''
}

// 转换时间格式
const dayjs = require('dayjs')
export default {
  mixins: [commonTypes, requestMethods, operatorTypes, statuses],
  // 定义数据模型
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: [], // 日志列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询条件
      dialogVisible: false, // 弹窗默认关闭
      operLogForm: defaultForm,
      // 批量删除选中的记录列表
      selectValue: []
    }
  },
  // 页面渲染之前获取数据
  created() {
    // 调用列表方法
    this.fetchData()
  },
  // 定义方法
  methods: {
    // 使用dayjs自定义时间格式
    dateFormat(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return ''
      }
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    // 重置表单
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },
    // 改变每页条数
    sizeChange(size) {
      this.limit = size
      this.fetchData()
    },
    // 条件分页查询列表
    // pageNum查询页数（默认第一页）
    fetchData(pageNum = 1) {
      // 页数赋值
      this.page = pageNum
      // 查询条件（当前页、每页条数）
      this.searchObj.current = this.page
      this.searchObj.limit = this.limit
      // ajax调用api
      api.getPageList(this.searchObj)
        .then(response => {
          // 不转圈
          this.listLoading = false
          // 每页数据
          this.list = response.data.records
          // 总记录数据
          this.total = response.data.total
        })
    },
    // 根据id删除数据
    removeDataById(id) {
      this.$confirm('此操作将永久删除日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return api.removeById(id)
      }).then((response) => {
        // 删除后刷新表
        this.fetchData(this.page)
        this.$message.success(response.message || '删除成功')
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },
    // 详情-根据id
    getById(id) {
      // 根据日志id查询后端数据库获取日志详情，还可直接查询前端list获取
      // // 弹窗
      this.dialogVisible = true
      api.getById(id).then(response => {
        this.operLogForm = response.data
      })
      // 直接从表单获取
      // Object.assign(this.operLog, this.list.find(oper => oper.id === id))
      // this.dialogVisible = true
    },
    // 当多选选项发生变化的时候调用
    handleSelectionChange(selection) {
      this.selectValue = selection
      console.log(this.selectValue)
    },
    // 批量删除
    batchRemove() {
      // 判断是否等于0 也就是没有选择复选框
      if (this.selectValue.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将永久删除日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，远程调用ajax
        // 遍历selection，将id取出放入id列表
        const idList = []
        this.selectValue.forEach(item => {
          idList.push(item.id)
        })
        // 调用api
        return api.batchRemove(idList)
      }).then((response) => {
        this.fetchData()
        this.$message.success(response.message)
      }).catch(error => {
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
      })
    }
  }
}
</script>
