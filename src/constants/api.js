// 接口常量定义
// ==================== user.js ====================
// 用户登录
export const API_USER_LOGIN = '/api/v1/index/login'
// 用户信息
export const API_USER_INFO = '/api/v1/index/info'
// 用户注销
export const API_USER_LOGOUT = '/api/v1/index/logout'
// 获取验证码
export const API_LOGIN_CODE = '/api/v1/index/code'

// ==================== sort.js ====================
// 根据ID获取类别列表
export const API_SORT_ID = '/api/v1/sort/'
// 获取类别列表
export const API_SORT_LIST = '/api/v1/sort/list'
// 删除类别
export const API_SORT_REMOVE = '/api/v1/sort/remove'
// 批量删除类别
export const API_SORT_BATCH = '/api/v1/sort/batchRemove'
// 保存类别
export const API_SORT_SAVE = '/api/v1/sort/save'
// 更新类别
export const API_SORT_UPDATE = '/api/v1/sort/update'
// 更新类别状态
export const API_SORT_STATUS = '/api/v1/sort/updateStatus'
// 首页展示类别和标签
export const API_SORTTAG_VIEW = '/api/v1/sort/sortTag'

// ==================== tag.js ====================
// 根据ID获取标签列表
export const API_TAG_ID = '/api/v1/tag/'
// 获取标签列表
export const API_TAG_LIST = '/api/v1/tag/list'
// 删除标签
export const API_TAG_REMOVE = '/api/v1/tag/remove'
// 批量删除标签
export const API_TAG_BATCH = '/api/v1/tag/batchRemove'
// 保存标签
export const API_TAG_SAVE = '/api/v1/tag/save'
// 更新标签
export const API_TAG_UPDATE = '/api/v1/tag/update'
// 更新标签状态
export const API_TAG_STATUS = '/api/v1/tag/updateStatus'
// 根据标签id获取类别信息数据
export const API_TAG_TO_ASSIGN = '/api/v1/tag/toAssign'
// 给标签分配类别
export const API_TAG_DO_ASSIGN = '/api/v1/tag/doAssign'
// 图标上传地址
export const API_TAG_ICOUPLOAD = '/api/v1/file/fastdfs/upload'
// 图标删除
export const API_TAG_ICOUPREMOVE = '/api/v1/file/fastdfs/remove?fileId='
// 更新标签图标
export const API_TAG_ICON = '/api/v1/tag/updateTagIcon'

// ==================== menu.js ====================
// 获取权限(菜单/功能)列表
export const API_MENU_LIST = '/api/v1/menu/findNodes'
// 保存菜单
export const API_MENU_SAVE = '/api/v1/menu/save'
// 更新菜单
export const API_MENU_UPDATE = '/api/v1/menu/update'
// 删除菜单
export const API_MENU_REMOVE = '/api/v1/menu/remove'
// 查看某个角色的权限列表
export const API_MENU_TO_ASSIGN = '/api/v1/menu/toAssign'
// 给某个角色授权
export const API_MENU_DO_ASSIGN = '/api/v1/menu/doAssign'
// 更新菜单状态
export const API_MENU_STATUS = '/api/v1/menu/updateStatus'

// ==================== role.js ====================
// 获取角色分页列表
export const API_ROLE_LIST = '/api/v1/role/list'
// 新增角色
export const API_ROLE_SAVE = '/api/v1/role/save'
// 根据id查询角色
export const API_ROLE_ID = '/api/v1/role/findRoleById'
// 更新角色
export const API_ROLE_UPDATE = '/api/v1/role/update'
// 删除角色
export const API_ROLE_REMOVE = '/api/v1/role/remove'
// 批量删除角色
export const API_ROLE_BATCH = '/api/v1/role/batchRemove'

// ==================== user.js ====================
// 获取用户分页列表
export const API_USER_LIST = '/api/v1/user/list'
// 新增用户
export const API_USER_SAVE = '/api/v1/user/save'
// 根据id查询用户
export const API_USER_ID = '/api/v1/user/findUserById'
// 更新用户
export const API_USER_UPDATE = '/api/v1/user/update'
// 删除用户
export const API_USER_REMOVE = '/api/v1/user/remove'
// 更新用户状态
export const API_USER_STATUS = '/api/v1/user/updateStatus'
// 根据用户id查询用户已分配的角色
export const API_USER_TO_ASSIGN = '/api/v1/user/toAssign'
// 给用户分配角色
export const API_USER_DO_ASSIGN = '/api/v1/user/doAssign'
// 更新图片
export const API_USER_AVATAR = '/api/v1/user/updateUserAvatar'
