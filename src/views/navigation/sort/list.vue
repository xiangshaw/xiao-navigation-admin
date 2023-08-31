<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row style="display:flex">
          <el-col :span="24">
            <el-form-item label="类别名称">
              <el-input v-model="searchObj.keyword" style="width: 20%" placeholder="类别名称" />
              &nbsp;
              <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添 加</el-button>
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
        label="序号"
        width="70"
        align="center"
      >
        <template #default="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="sortName" label="类别名称" />
      <el-table-column prop="description" label="类别描述" />
      <el-table-column prop="ord" sortable label="排序" />
      <el-table-column label="状态" width="80">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status === false"
            @change="switchStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" sortable label="创建时间" :formatter="dateFormat" width="160" />
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row.id)" />
          <!-- scope.row.id 得到整个表.所有行.id  -->
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
    <!-- 添加/修改 弹窗 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="sortDataForm" :model="sort" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="类别名称">
          <el-input v-model="sort.sortName" />
        </el-form-item>
        <el-form-item label="类别描述">
          <el-input v-model="sort.description" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="sort.ord" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 引入定义接口的js文件
import api from '@/api/navigation/sort'

const sortDataForm = {
  sortName: '',
  description: '',
  ord: 1
}
// 转换时间格式
const dayjs = require('dayjs')
export default {
  // 定义数据模型
  data() {
    return {
      listLoading: true, // 数据是否正在加载
      list: [], // 角色列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询条件

      dialogVisible: false,
      // 封装添加表单数据
      sort: sortDataForm,

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
    // 切换类被状态
    switchStatus(row) {
      // 0正常 1停用
      // 判断，如果当前类别可用，修改禁用
      // 首先通过row取到每行status值，可用切换位不可用，不可用切换为可用
      row.status = row.status === false
      api.updateStatus(row.id, row.status).then(response => {
        if (response.code === 200) {
          // 提示
          this.$message.success(response.message || '操作成功')
          // 刷新
          this.fetchData()
        }
      })
    },
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
          // 每页数据
          this.list = response.data.records
          // 总记录数据
          this.total = response.data.total
          // 数据加载并绑定成功,取消转圈
          this.listLoading = false
        })
    },
    // 根据id删除数据
    removeDataById(id) {
      this.$confirm('此操作将永久删除该类别, 是否继续?', '提示', {
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
        this.fetchData(this.page)
      })
    },
    // 弹出添加的表单
    add() {
      // 弹窗
      this.dialogVisible = true
      // 清空数据，方便数据添加
      this.sort = { ord: 1 }
    },
    // 添加或更新--根据有无ID判断
    saveOrUpdate() {
      if (!this.sort.id) {
        this.saveSort()
      } else {
        this.updateSort()
      }
    },

    // 添加
    saveSort() {
      api.saveSort(this.sort).then(response => {
        this.$message.success(response.message || '添加成功')
        // 关闭弹窗
        this.dialogVisible = false
        // 刷新页面
        this.fetchData(this.page)
      })
    },
    // 编辑-根据id
    edit(id) {
      // 根据用户id查询后端数据库获取用户，还可直接查询前端list获取
      // // 弹窗
      // this.dialogVisible = true
      // api.getRoleId(id).then(response => {
      //   this.sort = response.data.data
      // })
      Object.assign(this.sort, this.list.find(sort => sort.id === id))
      this.dialogVisible = true
    },
    // 更新
    updateSort() {
      api.updateById(this.sort).then(response => {
        this.$message.success(response.message || '操作成功')
        // 关闭弹窗
        this.dialogVisible = false
        // 刷新页面
        this.fetchData(this.page)
      })
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
      this.$confirm('此操作将永久删除该类别, 是否继续?', '提示', {
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
          this.fetchData(this.page)
        }
      })
    }
  }
}
</script>
