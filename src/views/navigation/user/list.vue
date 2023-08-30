<template>
  <div class="app-container">

    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关 键 字">
              <el-input v-model="searchObj.keyword" style="width: 95%" placeholder="用户名/姓名/手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="margin-right: 10px;width: 100%;"
              />
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
    <!-- 给需要权限判断的按钮都加上 :disabled="$hasBP('bnt.user.add')  === false"按钮权限判断 -->
    <div class="tools-div">
      <el-button
        type="success"
        :disabled="$hasBP('user:add') === false"
        icon="el-icon-plus"
        size="mini"
        @click="add"
      >添 加
      </el-button>
    </div>

    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ textAlign: 'center' }"
      style="width: 100%;margin-top: 10px;"
    >

      <el-table-column
        label="序号"
        width="70"
        align="center"
      >
        <template #default="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="nickname" label="呢称" width="110" />
      <el-table-column
        label="用户头像"
      >
        <template #default="scope">
          <div class="demo-image__preview">
            <el-image
              style="width: 60px; height: 60px;"
              :src="host + scope.row.avatar"
              :preview-src-list="[host + scope.row.avatar]"
              preview-teleported="true"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机" />
      <el-table-column label="状态" width="80">
        <template #default="scope">
          <!--v-model 指令的值应该是一个变量，用于与组件内部的数据属性进行双向绑定-->
          <el-switch
            v-model="scope.row.status===false"
            @change="switchStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :formatter="dateFormat" label="创建时间" />

      <el-table-column label="操作" align="center" fixed="right">
        <template #default="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row.id)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" @click="removeDataById(scope.row.id)" />
          <el-button
            type="warning"
            icon="el-icon-baseball"
            size="mini"
            title="分配角色"
            @click="showAssignRole(scope.row)"
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
    <!-- 分配角色弹窗  -->
    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="user.username" />
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选
          </el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" @click="assignRole">保存</el-button>
        <el-button size="small" @click="dialogRoleVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 添加/修改弹窗 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="user" label-width="100px" size="small" style="padding-right: 40px;">
        <el-form-item v-if="!user.id" label="用户名" prop="username">
          <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item v-if="!user.id" label="密码" prop="password">
          <el-input v-model="user.password" type="password" />
        </el-form-item>
        <el-form-item label="呢称" prop="nickname">
          <el-input v-model="user.nickname" maxlength="10" show-word-limit />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            ref="upload"
            action=""
            class="avatar-uploader"
            :show-file-list="false"
            :http-request="uploadAvatarApi"
            :before-upload="beforeAvatarUpload"
            multiple
            :limit="1"
          >
            <!-- 如果已经上传了图标，显示上传的图标 -->
            <img v-if="user.avatar" :src="host + user.avatar" class="avatar" alt="无" style="max-width: 60px; max-height: 60px;">
            <!-- 如果没有上传图标 -->
            <div v-else>
              <!-- 鼠标悬停在 el-icon-plus 时显示提示 -->
              <div @mouseover="showAvatarUploadTip = true" @mouseout="showAvatarUploadTip = false">
                <i class="el-icon-plus avatar-uploader-icon" />
                <!-- 根据 showUploadTip 显示/隐藏提示文本 -->
                <div v-if="showAvatarUploadTip" class="upload-tip">点击上传头像</div>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="user.phone" maxlength="11" show-word-limit />
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
.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>

<script>
// 引入定义接口的js文件
import api from '@/api/navigation/user'
// 转换时间格式
const dayjs = require('dayjs')
const defaultForm = {
  id: '',
  username: '',
  password: '',
  nickname: '',
  phone: '',
  status: false
}
export default {
  data() {
    return {
      showAvatarUploadTip: false, // 添加此属性来控制提示文本的显示
      host: '', // 图标地址

      listLoading: true, // 数据是否正在加载
      list: null, // banner列表
      total: 0, // 数据库中的总记录数
      page: 1, // 默认页码
      limit: 10, // 每页记录数
      searchObj: {}, // 查询表单对象

      createTimes: [], // 数组 开始和结束时间
      dialogVisible: false, // 弹窗效果
      user: defaultForm, // 封装添加表单数据

      dialogRoleVisible: false,
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      isIndeterminate: false, // 是否是不确定的
      checkAll: false // 是否全选
    }
  },
  // 生命周期函数：内存准备完毕，页面尚未渲染
  created() {
    // console.log('list created......')
    this.fetchData()
  },
  // 生命周期函数：内存准备完毕，页面渲染成功
  mounted() {
    // console.log('list mounted......')
  },

  methods: {
    // 用户头像上传处理
    uploadAvatarApi(res) {
      const formData = new FormData()
      formData.append('file', res.file)
      // 调用删除API
      if (this.user.avatar) {
        api.removeUserAvatarById(this.user.avatar)
          .then(response => {
            console.log('原头像删除成功:', JSON.stringify(response.data))
            // 继续上传新头像
            this.uploadNewAvatar(formData)
          })
          .catch(error => {
            console.error('原头像删除失败:', error)
            this.$message.error('原头像删除失败')
            this.$refs.upload.clearFiles() // 清除上传组件
          })
      } else {
        // 如果没有原图像，直接上传新图像
        this.uploadNewAvatar(formData)
      }
    },
    // 上传新头像
    uploadNewAvatar(formData) {
      api.uploadUserAvatar(formData)
        .then(response => {
          console.log('新头像上传成功:', JSON.stringify(response.data))
          this.user.avatar = response.data
          // 刷新数据
          this.fetchData()
          // 在上传成功后，调用更新头像地址的 API
          // 使用 encodeURIComponent 对 头像 进行编码（因为包含斜杠字符串）
          const userAvatar = (this.user.avatar.replace(/\//g, '_')) // 将斜杠替换为下划线
          this.updateUserAvatar(this.user.id, userAvatar)
        })
        .catch(error => {
          console.error('新头像上传失败:', error)
          this.$message.error('新头像上传失败')
          this.$refs.upload.clearFiles() // 清除上传组件
        })
    },
    // 更新头像
    updateUserAvatar(id, userAvatar) {
      api.updateAvatar(id, userAvatar)
        .then(response => {
          console.log('头像更新成功:', JSON.stringify(response.data))
          this.$message.success('头像更新成功')
        })
        .catch(error => {
          console.error('头像更新失败:', error)
          this.$message.error('头像更新失败')
        })
    },
    // 头像上传前校验
    beforeAvatarUpload(file) {
      // 支持的格式类型
      const imageFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/x-icon', 'image/webp']
      // 图标大小限制，单位为MB
      const imageSizeLimit = 2
      // 检查文件类型是否为支持的图标格式
      const userAvatar = imageFormats.includes(file.type)
      // 检查文件大小是否在限制范围内
      const userAvatarWithinSizeLimit = file.size / 1024 / 1024 < imageSizeLimit

      if (!userAvatar) {
        this.$message.error('头像格式只能为（JPEG、PNG、GIF、ICO、WEBP）!')
      }
      if (!userAvatarWithinSizeLimit) {
        this.$message.error('头像大小不能超过 ${imageSizeLimit}MB!')
      }
      return userAvatar && userAvatarWithinSizeLimit
    },
    // 使用dayjs自定义时间格式
    dateFormat(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return ''
      }
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
    },
    // 切换用户状态
    switchStatus(row) {
      // 判断，如果当前用户可用，修改禁用
      // 首先通过row取到每行status值，可用切换位不可用，不可用切换为可用
      row.status = row.status === false
      api.updateStatus(row.id, row.status).then(response => {
        if (response.code) {
          // 提示
          this.$message.success(response.message || '操作成功')
          // 刷新
          this.fetchData()
        }
      })
    },
    // 改变每页条数
    sizeChange(size) {
      this.limit = size
      this.fetchData()
    },
    // 加载banner列表数据
    // pageNum查询页数（默认第一页）
    fetchData(page = 1) {
      // 页数赋值
      this.page = page
      // createTimes是一个数组 开始和结束
      if (this.createTimes && this.createTimes.length === 2) {
        this.searchObj.createTimeBegin = this.createTimes[0]
        this.searchObj.createTimeEnd = this.createTimes[1]
      }
      // 查询条件（当前页、每页条数）
      this.searchObj.current = this.page
      this.searchObj.limit = this.limit
      api.getPageList(this.searchObj).then(
        response => {
          this.host = response.host
          this.list = response.data.records
          this.total = response.data.total
          // 数据加载并绑定成功
          this.listLoading = false
        }
      )
    },

    // 重置查询表单
    resetData() {
      this.searchObj = {}
      this.createTimes = []
      this.fetchData()
    },

    // 根据id删除数据
    removeDataById(id) {
      // debugger
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // promise
        // 点击确定，远程调用ajax
        return api.removeById(id)
      }).then((response) => {
        this.fetchData(this.page)
        this.$message.success(response.message || '删除成功')
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },

    // 弹出添加表单
    add() {
      this.dialogVisible = true
      this.user = {}
    },
    // 编辑，根据id查询，数据回显
    edit(id) {
      // 弹窗
      this.dialogVisible = true
      api.getById(id).then(response => {
        this.user = response.data
      })
    },

    // 添加或更新
    saveOrUpdate() {
      // 如果没id就是添加，有就是修改
      if (!this.user.id) {
        this.saveUser()
      } else {
        this.updateUser()
      }
    },

    // 添加
    saveUser() {
      api.saveUser(this.user).then(response => {
        // 提示
        this.$message.success('添加成功')
        // 关闭弹窗
        this.dialogVisible = false
        // 刷新
        this.fetchData(this.page)
        // 清除上传文件
        this.$refs.upload.clearFiles()
      })
    },

    // 更新
    updateUser() {
      api.updateById(this.user).then(response => {
        // 提示
        this.$message.success(response.message || '修改成功')
        // 关闭弹窗
        this.dialogVisible = false
        // 刷新
        this.fetchData(this.page)
        // 清除上传文件
        this.$refs.upload.clearFiles()
      })
    },

    // 展示分配角色
    showAssignRole(row) {
      this.user = row
      this.dialogRoleVisible = true
      api.getRolesByUserId(row.id).then(response => {
        // 所有的角色
        this.allRoles = response.data.allRoles
        console.log('这是所有的角色allRoles: ' + JSON.stringify((this.allRoles)))
        // 分配的角色
        this.userRoleIds = response.data.userRoleIds
        console.log('这是分配的角色userRoles: ' + JSON.stringify(this.userRoleIds[0]))
        console.log('这是分配的角色userRoles: ' + JSON.stringify(this.userRoleIds[1]))
        this.checkAll = this.userRoleIds.length === this.allRoles.length
        this.isIndeterminate = this.userRoleIds.length > 0 && this.userRoleIds.length < this.allRoles.length
      })
    },

    /*
    全选勾选状态发生改变的监听
    */
    handleCheckAllChange(value) { // value 当前勾选状态true/false
      // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
      this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
      // 如果当前不是全选也不全不选时, 指定为false
      this.isIndeterminate = false
    },

    /*
    角色列表选中项发生改变的监听
    */
    handleCheckedChange(value) {
      const { userRoleIds, allRoles } = this
      this.checkAll = userRoleIds.length === allRoles.length && allRoles.length > 0
      this.isIndeterminate = userRoleIds.length > 0 && userRoleIds.length < allRoles.length
    },

    // 分配角色
    assignRole() {
      const assignRoleVo = {
        // 用户id 角色id
        userId: this.user.id,
        roleIdList: this.userRoleIds
      }
      api.assignRoles(assignRoleVo).then(response => {
        this.$message.success(response.message || '分配角色成功')
        this.dialogRoleVisible = false
        this.fetchData(this.page)
      })
    }
  }
}
</script>
