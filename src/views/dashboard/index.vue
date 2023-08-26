<template>
  <div class="app">
    <!-- 外部容器 -->
    <div class="categories">
      <!-- 类别容器 -->
      <div v-if="Object.keys(sortTagData).length === 0" class="no-tags">
        暂无标签，快去添加吧~
      </div>
      <div v-for="(items, sortName) in sortTagData" v-else :key="sortName" class="sortName">
        <!-- 类别名称 -->
        <h3>{{ sortName }}</h3>
        <!-- 标签容器 -->
        <div class="items">
          <a
            v-for="item in items"
            :key="item.tagName"
            class="item"
            :href="item.tagUrl"
            target="_blank"
            @mouseover="showDescription(item)"
            @mouseout="hideDescription(item)"
          >
            <!-- 图标 -->
            <div class="icon">
              <img :src="host + item.tagIcon" :alt="item.tagName">
              <!-- 描述 -->
              <div class="description">
                <span>{{ item.description }}</span>
              </div>
            </div>
            <!-- 标签名 -->
            <div class="tagName">{{ item.tagName }}</div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/navigation/sort'

export default {
  data() {
    return {
      host: '', // 图标地址
      sortTagData: {} // 存储标签数据
    }
  },
  created() {
    this.sortTagDataView()
  },
  methods: {
    sortTagDataView() {
      // 获取标签数据并排序
      api.sortTagView().then(res => {
        this.host = res.host
        const sortedData = {}
        for (const sortName in res.data) {
          // 检查属性是否存在
          if (Object.prototype.hasOwnProperty.call(res.data, sortName)) {
            const items = res.data[sortName]
            // 根据ord字段升序排序
            items.sort((a, b) => a.ord - b.ord)
            // 存储排序后的标签数据
            sortedData[sortName] = items
          }
        }
        // 更新数据
        this.sortTagData = sortedData
      })
    },
    showDescription(item) {
      // 当鼠标悬停时，显示描述框
      item.showDescription = true
    },
    hideDescription(item) {
      // 当鼠标移出时，隐藏描述框
      item.showDescription = false
    }
  }
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column; /* 列表纵向排列 */
  align-items: center; /* 水平居中对齐 */
  gap: 2px; /* 间隙 */
  /* 外边距 */
  padding: 0 20px 20px;
}

.categories {
  width: 100%; /* 类别容器占满宽度 */
}

.sortName {
  border-bottom: 1px solid #ccc;
  border-radius: 1px;
  padding: 1px;
  margin-bottom: 1px; /* 底部间距增加 */
  width: 100%; /* 类别占满宽度 */
}

.no-tags {
  text-align: center;
  padding: 10px;
  font-size: 16px;
  color: #999;
}

.items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.item {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 100%;
  max-width: 100px;
  text-align: center;
  position: relative; /* 添加相对定位，为描述框提供定位上下文 */
}

.icon img {
  max-width: 70%; /* 图标宽度占满容器 */
}

.description {
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px;
  position: absolute;
  bottom: 100%; /* 调整描述框的位置，显示在图标上方 */
  left: 50%;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  max-width: 150px;
  white-space: nowrap;
  text-overflow: ellipsis;
  z-index: 2;
}

.description::before {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent rgba(0, 0, 0, 0.8) transparent;
}

.item:hover .description {
  bottom: 115%; /* 调整描述框的位置 */
  visibility: visible;
  opacity: 1;
}

@media screen and (max-width: 768px) {
  .item {
    width: 22%; /* 在小屏幕上每行标签，宽度 */
  }
}
</style>
