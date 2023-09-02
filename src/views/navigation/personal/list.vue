<template>
  <div class="centered-container">
    <el-card class="full-card" v-loading="listLoading">
      <div class="card-content">
        <el-form ref="userInfo" :model="userInfo" label-width="80px">
          <el-form-item
            style="text-align: center;display: grid; align-items: center; justify-content: center; margin: auto;"
            label-width="0"
          >
            <el-form-item>
              <el-upload
                ref="upload"
                action=""
                class="avatar-uploader"
                :show-file-list="false"
                :http-request="uploadUserInfoAvatarApi"
                :before-upload="beforeUserInfoAvatarUpload"
                multiple
                :limit="1"
              >
                <!-- 如果已经上传了图标，显示上传的图标 -->
                <img
                  v-if="userInfo.avatar"
                  :src="host + userInfo.avatar"
                  class="avatar"
                  alt="无"
                >
                <!-- 如果没有上传图标 -->
                <div v-else>
                  <!-- 鼠标悬停在 el-icon-plus 时显示提示 -->
                  <div @mouseover="showAvatarUploadTip = true" @mouseout="showAvatarUploadTip = false">
                    <i class="el-icon-plus avatar-uploader-icon"/>
                    <!-- 根据 showUploadTip 显示/隐藏提示文本 -->
                    <div v-if="showAvatarUploadTip" class="upload-tip">点击上传头像</div>
                  </div>
                </div>
              </el-upload>
            </el-form-item>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="userInfo.nickname" @input="formChangedHandler"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="userInfo.phone" @input="formChangedHandler"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="userInfo.description"
              show-word-limit
              autosize
              maxlength="100"
              type="textarea"
              clearable
              @input="formChangedHandler"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center">
          <el-button type="primary" :disabled="!formChanged" @click="updateUser">更新</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// 转换时间格式
import { mapGetters } from 'vuex'
// 引入定义接口的js文件
import api from '@/api/navigation/user'
import router from '@/router'

const dayjs = require('dayjs')
// var timeCycle = Date.parse($('#myTime').val())
export default {
  name: 'Personal',
  data() {
    return {
      listLoading: true, // 控制加载状态，数据是否正在加载
      showAvatarUploadTip: false, // 控制提示文本的显示
      host: '', // 文件地址
      userInfo: {},
      formChanged: false // 跟踪表单数据变动
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created() {
    this.findUserInfo()
  },
  methods: {
    // 用户头像上传处理
    uploadUserInfoAvatarApi(res) {
      const formData = new FormData()
      formData.append('file', res.file)
      // 调用删除API
      if (this.userInfo.avatar) {
        api.removeUserAvatarById(this.userInfo.avatar)
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
          this.userInfo.avatar = response.data
          // 在上传成功后，调用更新头像地址的 API
          // 使用 encodeURIComponent 对 头像 进行编码（因为包含斜杠字符串）
          const userAvatar = (this.userInfo.avatar.replace(/\//g, '_')) // 将斜杠替换为下划线
          this.updateUserAvatar(this.userInfo.id, userAvatar)
          // 在修改成功后，使用 Vue Router 刷新当前路由页面
          router.go(0)
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
    beforeUserInfoAvatarUpload(file) {
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
    // 时间格式化
    dateFormat(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return ''
      }
      return dayjs(cellValue).format('YY-MM-DD HH:mm:ss')
    },
    // 获取用户信息
    findUserInfo() {
      this.listLoading = true
      api.getById(this.userId).then(response => {
        this.host = response.host
        this.userInfo = response.data
        this.listLoading = false
      })
    },
    // 更新用户信息
    updateUser() {
      this.listLoading = true
      api.updateInfo(this.userInfo).then(response => {
        // 提示
        this.$message.success(response.message || '修改成功')
        // 清除上传文件
        this.$refs.upload.clearFiles()
        // 重置表单数据变动标志
        this.formChanged = false
        this.listLoading = false
        // 刷新
        this.fetchData(this.page)
      })
    },
    // 表单数据变化时触发
    formChangedHandler() {
      this.formChanged = true
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 130px;
  height: 130px;
  display: block;
}

.centered-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100vh; /* 使容器铺满整个视口高度 */

}

.full-card {
  width: 100%; /* 铺满视口宽度 */
  height: 100%; /* 铺满视口高度 */
  display: flex;
  flex-direction: column;
  //justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.card-content {
  /* 卡片内部内容的样式 */
  width:300px;
}
</style>
