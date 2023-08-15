// 提供子模块相关数据的getters计算属性
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  // 新增按钮和菜单
  buttons: state => state.user.buttons,
  menus: state => state.user.menus
}
export default getters
