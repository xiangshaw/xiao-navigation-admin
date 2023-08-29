<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色名称">
              <el-input v-model="searchObj.roleName" style="width: 100%" placeholder="角色名称" />
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

      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="description" label="角色描述" />
      <el-table-column prop="createTime" label="创建时间" :formatter="dateFormat" width="160" />
      <el-table-column label="操作" width="260" align="center" fixed="right">
        <template #default="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row.id)" />
          <!-- scope.row.id 得到整个表.所有行.id -->
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeDataById(scope.row.id)" />
          <el-button
            type="warning"
            icon="el-icon-baseball"
            size="mini"
            title="分配权限"
            @click="showAssignAuths(scope.row)"
          />
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
      @current-change="fetchData"
      @size-change="sizeChange"
    />
    <!-- 添加/修改 弹窗 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="role" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="角色名称">
          <el-input v-model="role.roleName" />
        </el-form-item>
        <el-form-item label="角色编码">
          <el-input v-model="role.roleCode" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="role.description" />
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
import api from '@/api/navigation/role'

const defaultForm = {
  id: '',
  roleName: '',
  roleCode: '',
  description: ''
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
      role: defaultForm,
      // 批量删除选中的记录列表
      selectValue: [],

      roleDeptdialogRoleVisible: false,
      allDept: [], // 所有部门列表
      roleDeptIds: [], // 部门的角色ID列表
      deptIsIndeterminate: false, // 是否是不确定的
      deptCheckAll: false // 是否全选
    }
  },
  // 页面渲染之前获取数据
  created() {
    // 调用列表方法
    this.fetchData()
  },
  // 定义方法
  methods: {
    // 跳转分配菜单权限（传入角色id 和 角色名称）
    showAssignAuths(row) {
      console.log(row.id + row.roleName)
      this.$router.push('/navigation/assignAuth?id=' + row.id + '&roleName=' + row.roleName)
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
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
    // 弹出添加的表单
    add() {
      // 弹窗
      this.dialogVisible = true
      // 清空数据，方便数据添加
      this.role = {}
    },
    // 添加或更新--根据有无ID判断
    saveOrUpdate() {
      if (!this.role.id) {
        this.saveRole()
      } else {
        this.updateRole()
      }
    },

    // 添加
    saveRole() {
      api.saveRole(this.role).then(response => {
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
      //   this.role = response.data.data
      // })
      Object.assign(this.role, this.list.find(role => role.id === id))
      this.dialogVisible = true
    },
    // 更新
    updateRole() {
      api.updateById(this.role).then(response => {
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
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
    },
    /*
   全选勾选状态发生改变的监听
   */
    roleDeptHandleCheckAllChange(value) { // value 当前勾选状态true/false
      // 如果当前全选, roleDeptIds就是所有部门id的数组, 否则是空数组
      this.roleDeptIds = value ? this.allDept.map(item => item.id) : []
      // 如果当前不是全选也不全不选时, 指定为false
      this.isIndeterminate = false
    }
  }
}
</script>
