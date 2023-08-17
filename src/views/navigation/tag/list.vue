<template>
  <div class="app-container">
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row style="display:flex">
          <el-col :span="24">
            <el-form-item label="标签名称">
              <el-input v-model="searchObj.keyword" style="width: 20%" placeholder="标签名称" />
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
      @selection-change="handleSelectionChangeSort"
    >
      <!-- 复选框 handleSelectionChangeSort触发方法-->
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
      <el-table-column prop="tagName" label="标签名称" />
      <el-table-column
        label="标签图标"
      >
        <template #default="scope">
          <div class="demo-image__preview">
            <el-image
              style="width: 60px; height: 60px;"
              :src="scope.row.tagIcon"
              :preview-src-list="[scope.row.tagIcon]"
              preview-teleported="true"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tagUrl" label="跳转地址">
        <template #default="scope">
          <a :href="scope.row.tagUrl" target="_blank" class="tagUrl-link">{{ scope.row.tagUrl }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="标签描述" />
      <el-table-column prop="ord" label="排序" />
      <el-table-column label="状态" width="80">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status === false"
            @change="switchStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" :formatter="dateFormat" width="160" />
      <el-table-column label="操作" width="200" align="center" fixed="right">
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row.tagId)" />
          <!-- scope.row.id 得到整个表.所有行.id  -->
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeDataById(scope.row.tagId)" />
          <el-button type="warning" icon="el-icon-baseball" size="mini" title="分配类别" @click="showAssignTags(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
    <!-- 分配类别弹窗  -->
    <el-dialog title="分配角色" :visible.sync="dialogTagVisible">
      <el-form label-width="80px">
        <el-form-item label="标签">
          <el-input disabled :value="tag.tagName" />
        </el-form-item>

        <el-form-item label="类别列表">
          <el-checkbox v-model="checkAllSort" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选
          </el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="tagSortIds" @change="handleCheckedChange">
            <el-checkbox v-for="sort in allSorts" :key="sort.id" :label="sort.id">{{ sort.sortName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="assignSort">保存</el-button>
        <el-button size="small" @click="dialogTagVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 添加/修改 弹窗 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="tagDataForm" :model="tag" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="标签名称">
          <el-input v-model="tag.tagName" />
        </el-form-item>
        <el-form-item label="标签图标">
          <el-upload
            ref="upload"
            action=""
            :http-request="uploadIconApi"
            :before-upload="beforeIconUpload"
            multiple
            :limit="1"
          >
            <el-button size="small" type="primary" plain>点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="标签描述">
          <el-input v-model="tag.description" />
        </el-form-item>
        <el-form-item label="跳转地址">
          <el-input v-model="tag.tagUrl" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="tag.ord" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style>
  .tagUrl-link {
    color: blue; /* 设置链接文字颜色为蓝色 */
    text-decoration: none; /* 移除下划线效果 */
  }
  .tagUrl-link:hover {
    color: #F77234;
    text-decoration: underline; /* 当鼠标悬停时显示下划线 */
  }
</style>
<script>
// 引入定义接口的js文件
import api from '@/api/navigation/tag'

const tagDataForm = {
  tagName: '',
  description: '',
  tagUrl: '',
  tagIcon: '',
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
      tag: tagDataForm,

      // 批量删除选中的记录列表
      selectSortValue: [],

      // 分配
      dialogTagVisible: false,
      allSorts: [], // 所有类别列表
      tagSortIds: [], // 标签的类别ID的列表
      isIndeterminate: false, // 是否是不确定的
      checkAllSort: false // 是否全选
    }
  },
  // 页面渲染之前获取数据
  created() {
    // 调用列表方法
    this.fetchData()
  },
  // 定义方法
  methods: {
    // 图标上传处理
    uploadIconApi(res) {
      const formData = new FormData()
      formData.append('file', res.file)
      api.uploadTagIcon(formData).then(response => {
        console.log('文件上传成功：', JSON.stringify((response.data)))
        this.tag.tagIcon = response.data
      }).catch(response => {
        // 上传失败
        console.error('文件上传失败：', res.message)
        this.$message.error('文件上传失败：' + res.message)
        // 清除文件（重置上传组件）
        this.$refs.upload.clearFiles()
      })
    },
    // 图标上传前校验
    beforeIconUpload(file) {
      // 支持的格式类型
      const imageFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/x-icon', 'image/webp']
      // 图片大小限制，单位为MB
      const imageSizeLimit = 2
      // 检查文件类型是否为支持的图片格式
      const tagIcon = imageFormats.includes(file.type)
      // 检查文件大小是否在限制范围内
      const tagIconWithinSizeLimit = file.size / 1024 / 1024 < imageSizeLimit

      if (!tagIcon) {
        this.$message.error('标签图标格式只能为（JPEG、PNG、GIF、ICO、WEBP）!')
      }
      if (!tagIconWithinSizeLimit) {
        this.$message.error('上传图标大小不能超过 ${imageSizeLimit}MB!')
      }
      return tagIcon && tagIconWithinSizeLimit
    },

    // 切换类被状态
    switchStatus(row) {
      // 0正常 1停用
      // 判断，如果当前标签可用，修改禁用
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
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
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
      this.tag = {}
    },
    // 添加或更新--根据有无ID判断
    saveOrUpdate() {
      if (!this.tag.tagId) {
        this.saveSort()
      } else {
        this.updateSort()
      }
    },

    // 添加
    saveSort() {
      api.saveSort(this.tag).then(response => {
        this.$message.success(response.message || '添加成功')
        // 关闭弹窗
        this.dialogVisible = false
        // 刷新页面
        this.fetchData(this.page)
      })
      // 清除上传文件
      this.$refs.upload.clearFiles()
    },
    // 编辑-根据id
    edit(tagId) {
      // 根据用户id查询后端数据库获取用户，还可直接查询前端list获取
      // // 弹窗
      // this.dialogVisible = true
      // api.getRoleId(id).then(response => {
      //   this.tag = response.data.data
      // })
      Object.assign(this.tag, this.list.find(tag => tag.tagId === tagId))
      this.dialogVisible = true
    },
    // 更新
    updateSort() {
      api.updateById(this.tag).then(response => {
        this.$message.success(response.message || '操作成功')
        // 关闭弹窗
        this.dialogVisible = false
        // 刷新页面
        this.fetchData(this.page)
      })
      // 清除上传文件
      this.$refs.upload.clearFiles()
    },
    // 展示分配类别
    showAssignTags(row) {
      this.tag = row
      this.dialogTagVisible = true
      // 获取标签Id去查询关联的类别数据
      api.getSortsByTagId(row.tagId).then(response => {
        // 所有的类别
        this.allSorts = response.data.allSorts
        console.log('这是所有的类别allSorts: ' + JSON.stringify((this.allSorts)))
        // 分配的类别
        this.tagSortIds = response.data.tagSortIds
        console.log('这是分配的类别tagSorts: ' + JSON.stringify(this.tagSortIds[0]))
        console.log('这是分配的类别tagSorts: ' + JSON.stringify(this.tagSortIds[1]))
        this.checkAllSort = this.tagSortIds.length === this.allSorts.length
        this.isIndeterminate = this.tagSortIds.length > 0 && this.tagSortIds.length < this.allSorts.length
      })
    },
    // 全选勾选状态发生改变的监听
    handleCheckAllChange(value) { // value 当前勾选状态true/false
      // 如果当前全选, tagSortIds就是所有类别id的数组, 否则是空数组
      this.tagSortIds = value ? this.allSorts.map(item => item.id) : []
      // 如果当前不是全选也不全不选时, 指定为false
      this.isIndeterminate = false
    },
    // 类别列表选中项发生改变的监听
    handleCheckedChange(value) {
      const { tagSortIds, allSorts } = this
      this.checkAllSort = tagSortIds.length === allSorts.length && allSorts.length > 0
      this.isIndeterminate = tagSortIds.length > 0 && tagSortIds.length < allSorts.length
    },
    // 分配类别
    assignSort() {
      const assignSortVo = {
        // 标签id 类别id
        tagId: this.tag.tagId,
        sortIdList: this.tagSortIds
      }
      api.assignSorts(assignSortVo).then(response => {
        this.$message.success(response.message || '分配类别成功')
        this.dialogTagVisible = false
        this.fetchData(this.page)
      })
    },

    // 当多选选项发生变化的时候调用
    handleSelectionChangeSort(selection) {
      this.selectSortValue = selection
      console.log(this.selectSortValue)
    },
    // 批量删除
    batchRemove() {
      // 判断是否等于0 也就是没有选择复选框
      if (this.selectSortValue.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定，远程调用ajax
        // 遍历selection，将id取出放入id列表
        const idList = []
        this.selectSortValue.forEach(item => {
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
