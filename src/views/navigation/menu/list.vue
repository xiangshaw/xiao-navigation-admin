<template>
  <div class="app-container">

    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add()">添 加</el-button>
    </div>
    <el-table
      :data="sysMenuList"
      style="width: 100%;margin-bottom: 20px;margin-top: 10px;"
      row-key="id"
      border
      :default-expand-all="false"
      :tree-props="{children: 'children'}"
    >

      <el-table-column prop="name" label="菜单名称" width="160" />
      <el-table-column label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="perms" label="权限标识" width="160" />
      <el-table-column prop="path" label="路由地址" width="120" />
      <el-table-column prop="component" label="组件路径" width="160" />
      <el-table-column prop="sortValue" label="排序" width="60" />
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status === false"
            @change="switchStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.type !== 2" type="success" icon="el-icon-plus" size="mini" title="添加下级节点" @click="add(scope.row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改" @click="edit(scope.row)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除" :disabled="scope.row.children.length > 0" @click="removeDataById(scope.row.id)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="menu" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item v-if="menu.id === ''" label="上级部门">
          <el-input v-model="menu.parentName" disabled="true" />
        </el-form-item>
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="menu.type" :disabled="typeDisabled">
            <el-radio :label="0" :disabled="type0Disabled">目录</el-radio>
            <el-radio :label="1" :disabled="type1Disabled">菜单</el-radio>
            <el-radio :label="2" :disabled="type2Disabled">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menu.name" />
        </el-form-item>
        <el-form-item v-if="menu.type !== 2" label="图标" prop="icon">
          <el-select v-model="menu.icon" clearable>
            <el-option v-for="item in iconList" :key="item.class" :label="item.class" :value="item.class">
              <span style="float: left;">
                <i :class="item.class" />  <!-- 如果动态显示图标，这里添加判断 -->
              </span>
              <span style="padding-left: 6px;">{{ item.class }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="menu.sortValue" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item prop="path">
          <span slot="label">
            <el-tooltip content="访问的路由地址，如：`user`" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
            路由地址
          </span>
          <el-input v-model="menu.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item v-if="menu.type !== 0" prop="component">
          <span slot="label">
            <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
            组件路径
          </span>
          <el-input v-model="menu.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item v-if="menu.type === 2">
          <el-input v-model="menu.perms" placeholder="请输入权限标识" maxlength="100" />
          <span slot="label">
            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(hasAuthority('bnt.role.list'))" placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
            权限字符
          </span>
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-radio-group v-model="menu.status">
            <el-radio :label="false">正常</el-radio>
            <el-radio :label="true">停用</el-radio>
          </el-radio-group>
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
import api from '@/api/navigation/menu'
const defaultForm = {
  id: '',
  parentId: '',
  name: '',
  type: 0,
  path: '',
  component: '',
  perms: '',
  icon: '',
  sortValue: 1,
  status: false
}
export default {
  // 定义数据
  data() {
    return {
      sysMenuList: [],
      expandKeys: [], // 需要自动展开的项

      typeDisabled: false,
      type0Disabled: false,
      type1Disabled: false,
      type2Disabled: false,
      dialogTitle: '',

      dialogVisible: false,
      menu: defaultForm,
      saveBtnDisabled: false,

      iconList: [
        {
          class: 'el-icon-s-tools'
        },
        {
          class: 'el-icon-s-custom'
        },
        {
          class: 'el-icon-setting'
        },
        {
          class: 'el-icon-user-solid'
        },
        {
          class: 'el-icon-s-help'
        },
        {
          class: 'el-icon-phone'
        },
        {
          class: 'el-icon-s-unfold'
        },
        {
          class: 'el-icon-s-operation'
        },
        {
          class: 'el-icon-more-outline'
        },
        {
          class: 'el-icon-s-check'
        },
        {
          class: 'el-icon-tickets'
        },
        {
          class: 'el-icon-s-goods'
        },
        {
          class: 'el-icon-document-remove'
        },
        {
          class: 'el-icon-warning'
        },
        {
          class: 'el-icon-warning-outline'
        },
        {
          class: 'el-icon-question'
        },
        {
          class: 'el-icon-info'
        }
      ]
    }
  },
  // 当页面加载时获取数据
  created() { // 页面渲染之前执行
    this.fetchData()
  },
  methods: {
    // 调用api层获取数据库中的数据
    fetchData() {
      console.log('加载列表')
      api.findNodes().then(response => {
        this.sysMenuList = response.data
        console.log(this.sysMenuList)
      })
    },
    // 切换菜单状态
    switchStatus(row) {
      row.status = row.status === false
      api.updateStatus(row.id, row.status).then(response => {
        if (response.code) {
          this.$message.success(response.message || '操作成功')
          this.fetchData()
        }
      })
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
        this.fetchData()
        this.$message({
          type: 'success',
          message: response.message
        })
      }).catch(() => {
        this.$message.info('取消删除')
      })
    },

    // 弹出添加或更新的表单
    add(row) {
      debugger
      this.typeDisabled = false
      this.dialogTitle = '添加下级节点'
      this.dialogVisible = true

      this.menu = Object.assign({}, defaultForm)
      this.menu.id = ''
      if (row) {
        this.menu.parentId = row.id
        this.menu.parentName = row.name
        // this.menu.component = 'ParentView'
        if (row.type === 0) {
          this.menu.type = 1
          this.typeDisabled = false
          this.type0Disabled = false
          this.type1Disabled = false
          this.type2Disabled = true
        } else if (row.type === 1) {
          this.menu.type = 2
          this.typeDisabled = true
        }
      } else {
        this.dialogTitle = '添加目录节点'
        this.menu.type = 0
        this.menu.component = 'Layout'
        this.menu.parentId = 0
        this.typeDisabled = true
      }
    },

    // 编辑
    edit(row) {
      debugger
      this.dialogTitle = '修改菜单'
      this.dialogVisible = true

      this.menu = Object.assign({}, row)
      this.typeDisabled = true
    },

    // 添加或更新
    saveOrUpdate() {
      if (this.menu.type === 0 && this.menu.parentId !== 0) {
        this.menu.component = 'ParentView'
      }
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          this.saveBtnDisabled = true // 防止表单重复提交
          if (!this.menu.id) {
            this.save()
          } else {
            this.update()
          }
        }
      })
    },

    // 添加
    save() {
      api.saveMenu(this.menu).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData(this.page)
      })
    },

    // 更新
    update() {
      api.updateById(this.menu).then(response => {
        this.$message.success(response.message || '操作成功')
        this.dialogVisible = false
        this.fetchData()
      })
    }
  }
}
</script>
