// 公共类型
// 业务类型
const businessTypeMap = {
  default: { color: '#FFECE8', text: '' },
  OTHER: { color: '#a9aeb8', text: '其它' },
  INSERT: { color: '#7BE188', text: '新增' },
  DELETE: { color: '#F53F3F', text: '删除' },
  BATCH_REMOVE: { color: '#A1151E', text: '批量删除' },
  UPDATE: { color: '#F99057', text: '修改' },
  SELECT: { color: '#DCF190', text: '查询' },
  ASSGIN: { color: '#792E00', text: '授权' },
  CAST: { color: '#37D4CF', text: '分配角色' },
  EXPORT: { color: '#6AA1FF', text: '导出' },
  IMPORT: { color: '#031A79', text: '导入' },
  EXIT: { color: '#F979B7', text: '退出' },
  FORCE: { color: '#77064F', text: '强制退出' },
  STATUS: { color: '#E13EDB', text: '更新状态' },
  CLEAN: { color: '#A1151E', text: '清空数据' }
}

export const commonTypes = {
  methods: {
    businessTypeTagType(businessType) {
      const mapping = businessTypeMap[businessType]
      return mapping ? mapping.color : ''
    },

    businessTypeTagText(businessType) {
      const mapping = businessTypeMap[businessType]
      return mapping ? mapping.text : ''
    }
  }
}

// 请求方式
const requestMethodMap = {
  default: { color: '#FFECE8', text: '' },
  POST: { color: '#FF7D00', text: 'POST' },
  GET: { color: '#00B42A', text: 'GET' },
  PUT: { color: '#F7BA1E', text: 'PUT' },
  PATCH: { color: '#FFECE8', text: 'PATCH' },
  DELETE: { color: '#F53F3F', text: 'DELETE' },
  COPY: { color: '#7BC0FC', text: 'COPY' },
  HEAD: { color: '#14C9C9', text: 'HEAD' },
  OPTIONS: { color: '#8D4EDA', text: 'OPTIONS' },
  LINK: { color: '#9FD4FD', text: 'LINK' },
  UNLINK: { color: '#89E9E0', text: 'UNLINK' },
  PURGE: { color: '#C9E968', text: 'PURGE' },
  LOCK: { color: '#FCF26B', text: 'LOCK' },
  UNLOCK: { color: '#FADC6D', text: 'UNLOCK' },
  PROPFIND: { color: '#FFB65D', text: 'PROPFIND' },
  VIEW: { color: '#FAAC7B', text: 'VIEW' }
}
export const requestMethods = {
  methods: {
    requestMethodType(requestMethod) {
      const mapping = requestMethodMap[requestMethod]
      return mapping ? mapping.color : ''
    },

    requestMethodText(requestMethod) {
      const mapping = requestMethodMap[requestMethod]
      return mapping ? mapping.text : ''
    }
  }
}

// 操作类别
const operatorTypeMap = {
  OTHER: { color: '#3491FA', text: '其它' },
  MANAGE: { color: '#E865DF', text: '后台用户' },
  MOBILE: { color: '#14C9C9', text: '手机端' }
}

export const operatorTypes = {
  methods: {
    operatorTypeType(operatorType) {
      const mapping = operatorTypeMap[operatorType]
      return mapping ? mapping.color : ''
    },

    operatorTypeText(operatorType) {
      const mapping = operatorTypeMap[operatorType]
      return mapping ? mapping.text : ''
    }
  }
}

// 操作状态
const statusMap = {
  false: { color: '#00B42A', text: '成功' },
  true: { color: '#F53F3F', text: '失败' }
}

export const statuses = {
  methods: {
    statusType(status) {
      const mapping = statusMap[status]
      return mapping ? mapping.color : ''
    },

    statusText(status) {
      const mapping = statusMap[status]
      return mapping ? mapping.text : ''
    }
  }
}
