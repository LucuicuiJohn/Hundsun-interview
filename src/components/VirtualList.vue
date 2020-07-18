<template>
  <div class="virtual-list-container" ref="listContainer">
    <div class="table-head">
      <div
        class="head-item"
        v-for="(item, index) in tableHeadList"
        :key="index"
      >
        {{ item.label }}
      </div>
    </div>
    <div
      ref="list"
      class="infinite-list-container"
      @scroll="scollEvent($event)"
    >
      <div
        class="infinite-list-phantom"
        :style="{ height: listHeight + 'px' }"
      ></div>
      <ul class="infinite-list" :style="{ transform: getTransForm }">
        <li
          ref="item"
          :class="
            currIndex === (index+1)
              ? 'infinite-list-item active'
              : 'infinite-list-item'
          "
          v-for="(item, index) in visibleData"
          :key="index"
          :style="{ height: itemSize + 'px', lineHeight: itemSize + 'px' }"
          @click="clickItem(item,index)"
        >
          <VirtualListItem
            :configData="configData"
            :itemData="item"
          ></VirtualListItem>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import VirtualListItem from '@/components/VirtualListItem.vue'

export default {
  name: 'VritualList',
  props: {
    configData: {
      type: Object,
      default: function () {}
    },
    listData: {
      type: Array,
      default: () => []
    },
    tableHeadList: {
      type: Array,
      default: () => []
    },
    itemSize: {
      type: Number,
      default: 200
    }
  },
  components: {
    VirtualListItem
  },
  data () {
    return {
      screenHeight: 0, // 可视区的高度
      startOffset: 0, // 偏移量
      start: 0, // 开始索引
      end: null, // 结束索引
      currIndex: 1
    }
  },
  computed: {
    // 列表总高度
    listHeight () {
      return this.listData.length * this.itemSize
    },
    // 可显示的列表项数
    visibleCount () {
      return Math.ceil(this.screenHeight / this.itemSize) // 向上取整
    },
    // 偏移量对应的style
    getTransForm () {
      return `translate3d(0,${this.startOffset}px,0)`
    },
    // 获取真实显示列表数据
    visibleData () {
      return this.listData.slice(
        this.start,
        Math.min(this.end, this.listData.length)
      )
    }
  },
  mounted () {
    this.screenHeight = 500
    this.start = 0
    this.end = this.start + this.visibleCount
    document.addEventListener('keydown', e => {
      if (e.keyCode === 38) {
        if (this.currIndex > 1) {
          this.currIndex--
        } else {
          this.currIndex = this.visibleCount
        }
      } else if (e.keyCode === 40) {
        if (this.currIndex < this.visibleCount) {
          this.currIndex++
        } else {
          this.currIndex = 1
        }
      }
    })
  },
  methods: {
    clickItem (item, index) {
      this.currIndex = (index + 1)
    },
    scollEvent () {
      // 当前滚动的top位置
      let scrollTop = this.$refs.list.scrollTop
      // 此时的开始索引
      this.start = Math.floor(scrollTop / this.itemSize) // 向下取整
      // 此时的结束索引
      this.end = this.start + this.visibleCount
      // 此时的偏移量
      this.startOffset = scrollTop - (scrollTop % this.itemSize)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-head {
  display: flex;
  background-color: #152d3f;
  color: #bbbbbb;
  height: 40px;
  line-height: 40px;
  width: 100%;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid #0f202d;
  .head-item {
    flex: 1;
    border-right: 1px solid #000;
  }
}
.infinite-list-container {
  height: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
  background-color: #152d3f;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  // position: absolute;
  text-align: center;
}

.infinite-list-item {
  padding: 0px;
  color: #555;
  box-sizing: border-box;
  &.active{
     background-color: #213756;
  }
}
// .infinite-list-item:hover {
//   background-color: #213756;
// }

</style>
