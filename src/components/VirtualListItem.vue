<template>
  <div class="virtual-list-item-container">
    <div class="list-content">
      <div class="item id">{{ itemData.id }}</div>
      <div class="item name">{{ itemData.otcName }}</div>
      <div class="item code">{{ itemData.code }}</div>
      <div class="item upDown">
        <span
          :style="{ color: configData.color.rise }"
          v-if="itemData.upDownPTC > 0"
          >+{{ itemData.upDownPTC }}%</span
        >
        <span
          :style="{ color: configData.color.fall }"
          v-else-if="itemData.upDownPTC < 0"
          >-{{ itemData.upDownPTC }}%</span
        >
      </div>
      <div class="item price">
        <span
          :style="{ color: configData.color.rise }"
          v-if="itemData.lastPrice > itemData.closePrice"
          >{{ itemData.lastPrice }}</span
        >
        <span
          :style="{ color: configData.color.fall }"
          v-else-if="itemData.lastPrice < itemData.closePrice"
          >{{ itemData.lastPrice }}</span
        >
      </div>
      <div class="item ">
        <span
          :style="{ color: configData.color.rise }"
          v-if="itemData.zhangdie > 0"
          >+{{ itemData.zhangdie }}%</span
        >
        <span
          :style="{ color: configData.color.fall }"
          v-else-if="itemData.zhangdie < 0"
          >-{{ itemData.zhangdie }}%</span
        >
      </div>
      <div class="item volumn money">{{ itemData.volumn }}</div>
      <div class="item balance money">{{ itemData.balance }}</div>
      <div class="item code">
        <span
          :style="{ color: configData.color.rise }"
          v-if="itemData.speed > 0"
          >+{{ itemData.speed }}%</span
        >
        <span
          :style="{ color: configData.color.fall }"
          v-else-if="itemData.speed < 0"
          >-{{ itemData.speed }}%</span
        >
      </div>
      <div class="item code">{{ itemData.changeHand }}</div>
      <div class="item code">
        <span
          :style="{ color: configData.color.rise }"
          v-if="itemData.liangbo > 1"
          >+{{ itemData.liangbo }}</span
        >
        <span
          :style="{ color: configData.color.fall }"
          v-else-if="itemData.liangbo < 1"
          >-{{ itemData.liangbo }}</span
        >
        <span :style="{ color: configData.color.stop }" v-else
          >-{{ itemData.liangbo }}</span
        >
      </div>
      <div class="item code">{{ itemData.openPrice }}</div>
      <div class="item price">
        <span
          :style="{ color: configData.color.rise }"
          v-if="itemData.highestPrice > itemData.closePrice"
          >{{ itemData.highestPrice }}</span
        >
        <span
          :style="{ color: configData.color.fall }"
          v-else-if="itemData.highestPrice < itemData.closePrice"
          >{{ itemData.highestPrice }}</span
        >
      </div>
      <div class="item code">
        <span
          :style="{ color: configData.color.rise }"
          v-if="itemData.lowestPrice > itemData.closePrice"
          >{{ itemData.lowestPrice }}</span
        >
        <span
          :style="{ color: configData.color.fall }"
          v-else-if="itemData.lowestPrice < itemData.closePrice"
          >{{ itemData.lowestPrice }}</span
        >
      </div>
      <div class="item code">{{ itemData.closePrice }}</div>
      <div class="item code">{{ itemData.shiyingRate }}</div>
      <div class="item code">{{ itemData.zhengfu }}</div>
      <div class="item code">{{ itemData.weibi }}</div>
      <div class="item code">{{ itemData.weicha }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VirtualListItem',
  data () {
    return {}
  },
  props: {
    configData: {
      type: Object,
      default: function () {}
    },
    itemData: {
      type: Object,
      default: function () {}
    }
  }
}
</script>
<style scoped lang="scss">
.virtual-list-item-container {
  .list-content {
    display: flex;
    color: #f8f8f8;
    .item {
      font-size: 14px;
      flex: 1;
      &.money {
        color: orange;
      }
    }
  }
}
</style>
