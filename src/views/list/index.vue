<template>
  <div class="list-container">
    <div class="list-table">
      <VirtualList :configData="configData" :tableHeadList="configMain" :listData="tableData" :itemSize="50"></VirtualList>
    </div>
  </div>
</template>
<script>
import tableConfig from './config'
import configData from '@/utils/config'
import VirtualList from '@/components/VirtualList.vue'

export default {
  name: 'list',
  data () {
    return {
      configData: configData, // 涨跌数据
      configMain: tableConfig.configTableHead,
      tableData: tableConfig.configTableData,
      tableLoading: true
    }
  },
  components: {
    VirtualList
  },
  methods: {
    indexMethod (index) {
      return index * 1
    },
    changeCode (row) {
      console.log('点击了这行...')
    },
    quoteSortChange (item) {}
  }
}
</script>
<style scoped lang="scss">
.list-table {
  height: 500px;
  width:100%;
  background:#eee;
}
</style>
