<template>
  <div class="kline-container">
    <div id="kline" ref="kline" height="500" width="1200"></div>
    <div id="Mouse">
      时间:<strong id="XXX"></strong> & 价格:<strong id="YYY"></strong>
    </div>
    <div id="x_div"></div>
    <div id="y_div"></div>
  </div>
</template>
<script>
import tableConfig from './config'

export default {
  name: 'list',
  data () {
    return {
      dataArr: tableConfig.dataArr,
      cBox: null, // dom对象
      canvas: null,
      ctx: null, // canvas DOM    canvas上下文
      mouseTimer: null, // 鼠标

      // 图表属性 //canvas中部的宽/高  canvas内边距/文字边距
      cWidth: 0,
      cHeight: 0,
      cMargin: 0,
      cSpace: 0,

      originX: 0,
      originY: 0,
      // 每个k线图间间距  数量 宽度   所有k线图的最大值/最小值
      bMargin: 0,
      tobalBars: 0, // k线数量
      bWidth: 0, // 宽度
      maxValue: 0, // 最大值
      minValue: 0, // 最小值

      totalYNomber: 0, // y轴上的标识数量

      showArr: [], // 显示出来的数据部分（因为可以选择范围，所以需要这个数据

      // 范围选择条中的调节按钮的位置，宽度
      dragBarX: 0,
      dragBarWidth: 0,
      // 运动相关变量
      ctr: null, // 运动的起步
      numctr: 0, // 共有多少步
      speed: 0, // 运动速度
      mousePosition: {} // 用户存放鼠标位置
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initCanvas()
    })
  },
  methods: {
    initCanvas () {
      // 创建canvas并获得canvas上下文
      this.cBox = document.getElementById('kline')
      this.canvas = document.createElement('canvas')
      if (this.canvas && this.canvas.getContext) {
        this.ctx = this.canvas.getContext('2d')
      }
      this.canvas.innerHTML = '你的浏览器不支持HTML5 canvas'
      this.cBox.appendChild(this.canvas)
      // 图标初始化
      this.initChart()
      this.drawLineLabelMarkers() // 绘制图表轴、标签和标记
      this.drawBarAnimate() // 绘制柱状图的动画

      // 检测鼠标移动
      this.addMouseMove()
      this.drawDragBar() // 绘制拖动轴
      this.drawKeyCode()// 键盘左右键
    },
    initChart () {
      this.cMargin = 60
      this.cSpace = 80
      // 将canvas扩大2倍，然后缩小，以适应高清屏幕
      this.canvas.width = this.cBox.getAttribute('width') * 2
      this.canvas.height = this.cBox.getAttribute('height') * 2
      this.canvas.style.height = this.canvas.height / 2 + 'px'
      this.canvas.style.width = this.canvas.width / 2 + 'px'
      this.cHeight = this.canvas.height - this.cMargin * 2 - this.cSpace * 2
      this.cWidth = this.canvas.width - this.cMargin * 2 - this.cSpace * 2
      this.originX = this.cMargin + this.cSpace
      this.originY = this.cMargin + this.cHeight // 坐标原点 x y
      this.showArr = this.dataArr.slice(0, parseInt(this.dataArr.length / 2))

      // 柱状图信息
      this.tobalBars = this.showArr.length
      this.bWidth = parseInt(this.cWidth / this.tobalBars / 3) // k线的宽度
      this.bMargin = parseInt(
        (this.cWidth - this.bWidth * this.tobalBars) / (this.tobalBars + 1)
      ) // k线的间距
      this.maxValue = 0
      this.minValue = 9999999
      for (var i = 0; i < this.dataArr.length; i++) {
        var barVal = this.dataArr[i][1][3]
        if (barVal > this.maxValue) {
          this.maxValue = barVal // 最高价
        }
        var barVal2 = this.dataArr[i][1][2]
        if (barVal2 < this.minValue) {
          this.minValue = barVal2 // 最低价
        }
      }
      this.maxValue += 20
      this.minValue -= 20
      this.totalYNomber = 10
      // 运动相关
      this.ctr = 1
      this.numctr = 50
      this.speed = 2

      this.dragBarWidth = 30 // 范围选择属性
      this.dragBarX =
        this.cWidth / 2 + this.cSpace + this.cMargin - this.dragBarWidth / 2 // 范围选择属性
    },
    addMouseMove () {
      let _this = this
      this.canvas.addEventListener('mousemove', e => {
        e = e || window.event
        if (e.offsetX || e.offsetX === 0) {
          _this.mousePosition.x = e.offsetX
          _this.mousePosition.y = e.offsetY
        } else if (e.layerX || e.layerX === 0) {
          _this.mousePosition.x = e.layerX
          _this.mousePosition.y = e.layerY
        }

        clearTimeout(_this.mouseTimer)
        _this.mouseTimer = setTimeout(() => {
          _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height)
          _this.drawLineLabelMarkers()
          _this.drawBarAnimate(true)
          _this.drawDragBar()
        }, 10)
      })
    },
    // 鼠标滑过柱子
    CrossLine (x, y) {
      let xdiv = document.getElementById('x_div')
      let ydiv = document.getElementById('y_div')
      let Mouse = document.getElementById('Mouse')
      const i = (parseInt(this.mousePosition.x * 2 / (this.bWidth + this.bMargin)) - 1)
      document.getElementById('XXX').innerHTML = this.dataArr[i][0]
      document.getElementById('YYY').innerHTML = this.dataArr[i][1][1]
      Mouse.style.top = this.mousePosition.y + 'px'
      Mouse.style.left = this.mousePosition.x + 'px'
      Mouse.style.display = 'block'
      xdiv.style.top = this.mousePosition.y + 'px'
      ydiv.style.left = this.mousePosition.x + 'px'
    },
    // 绘制图表轴、标签和标记
    drawLineLabelMarkers () {
      this.ctx.font = '24px Arial'
      this.ctx.lineWidth = 2
      this.ctx.fillStyle = '#000'
      this.ctx.strokeStyle = '#000'
      // y轴
      this.drawLine(this.originX, this.originY, this.originX, this.cMargin)
      // x轴
      this.drawLine(
        this.originX,
        this.originY,
        this.originX + this.cWidth,
        this.originY
      )

      // 绘制标记
      this.drawMarkers()
    },
    // 画线的方法
    drawLine (x, y, X, Y) {
      this.ctx.beginPath()
      this.ctx.moveTo(x, y)
      this.ctx.lineTo(X, Y)
      this.ctx.stroke()
      this.ctx.closePath()
    },
    // 绘制标记
    drawMarkers () {
      this.ctx.strokeStyle = '#E0E0E0'
      // 绘制 y
      var oneVal = (this.maxValue - this.minValue) / this.totalYNomber // y轴单位高度
      this.ctx.textAlign = 'right'
      for (let i = 0; i <= this.totalYNomber; i++) {
        var markerVal = parseInt(i * oneVal + this.minValue)
        var xMarker = this.originX - 10
        var yMarker = parseInt(
          this.originY -
            (this.cHeight * (markerVal - this.minValue)) /
              (this.maxValue - this.minValue)
        )

        this.ctx.fillText(markerVal, xMarker, yMarker + 3, this.cSpace) // 文字
        if (i > 0) {
          this.drawLine(
            this.originX + 2,
            yMarker,
            this.originX + this.cWidth,
            yMarker
          )
        }
      }

      // 绘制 x
      var textNb = 6
      this.ctx.textAlign = 'center'
      for (let i = 0; i < this.tobalBars; i++) {
        if (this.tobalBars > textNb && i % parseInt(this.tobalBars / 6) !== 0) {
          continue
        }
        let markerVal = this.dataArr[i][0]
        let xMarker = parseInt(
          this.originX +
            this.cWidth * (i / this.tobalBars) +
            this.bMargin +
            this.bWidth / 2
        )
        let yMarker = this.originY + 30
        this.ctx.fillText(markerVal, xMarker, yMarker, this.cSpace) // 文字
      }
      // 绘制标题 y
      this.ctx.save()
      this.ctx.rotate(-Math.PI / 2)
      this.ctx.fillText('指 数', -this.canvas.height / 2, this.cSpace - 20)
      this.ctx.restore()
      // 绘制标题 x
      this.ctx.fillText(
        '日 期',
        this.originX + this.cWidth / 2,
        this.originY + this.cSpace - 20
      )
    },
    // 绘制柱形图
    drawBarAnimate (mouseMove) {
      let parsent = this.ctr / this.numctr
      for (let i = 0; i < this.tobalBars; i++) {
        // let oneVal = parseInt(this.maxValue / this.totalYNomber)
        let data = this.dataArr[i][1]
        // 跌
        let color = '#199E00'
        let barVal = data[0]
        let disY = 0
        // 开盘0 收盘1 最低2 最高3   跌30C7C9  涨D7797F
        if (data[1] > data[0]) {
          // 涨
          color = '#EE1515'
          barVal = data[1]
          disY = data[1] - data[0]
        } else {
          disY = data[0] - data[1]
        }
        var showH =
          (disY / (this.maxValue - this.minValue)) * this.cHeight * parsent
        showH = showH > 2 ? showH : 2

        var barH = parseInt(
          (this.cHeight * (barVal - this.minValue)) /
            (this.maxValue - this.minValue)
        )
        var y = this.originY - barH
        var x =
          this.originX +
          ((this.bWidth + this.bMargin) * i + this.bMargin) * parsent
        this.drawRect(x, y, this.bWidth, showH, mouseMove, color, true) // 开盘收盘  高度减一避免盖住x轴

        // 最高最低的线
        showH =
          ((data[3] - data[2]) / (this.maxValue - this.minValue)) *
          this.cHeight *
          parsent
        showH = showH > 2 ? showH : 2

        y =
          this.originY -
          parseInt(
            (this.cHeight * (data[3] - this.minValue)) /
              (this.maxValue - this.minValue)
          )
        this.drawRect(
          parseInt(x + this.bWidth / 2 - 1),
          y,
          2,
          showH,
          mouseMove,
          color
        ) // 最高最低  高度减一避免盖住x轴
      }
      if (this.ctr < this.numctr) {
        this.ctr++
        let _this = this
        setTimeout(() => {
          _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height)
          _this.drawLineLabelMarkers()
          _this.drawBarAnimate()
          _this.drawDragBar()
        }, (_this.speed *= 0.03))
      }
    },
    // 绘制方块
    drawRect (x, y, X, Y, mouseMove, color, ifBigBar, ifDrag) {
      this.ctx.beginPath()
      if (parseInt(x) % 2 !== 0) {
        x++
      }
      if (parseInt(y) % 2 !== 0) {
        y++
      }
      if (parseInt(X) % 2 !== 0) {
        X++
      }
      if (parseInt(Y) % 2 !== 0) {
        Y++
      }
      this.ctx.rect(parseInt(x), parseInt(y), parseInt(X), parseInt(Y))

      if (
        ifBigBar &&
        mouseMove &&
        this.ctx.isPointInPath(
          this.mousePosition.x * 2,
          this.mousePosition.y * 2
        )
      ) {
        // 如果是鼠标移动的到柱状图上，重新绘制图表
        this.ctx.strokeStyle = color
        // this.ctx.strokeWidth = 20
        this.ctx.lineWidth = 10
        this.ctx.stroke()
        this.CrossLine()
      }
      // 如果移动到拖动选择范围按钮
      this.canvas.style.cursor = 'default'
      if (
        ifDrag &&
        this.ctx.isPointInPath(
          this.mousePosition.x * 2,
          this.mousePosition.y * 2
        )
      ) {
        // 如果是鼠标移动的到柱状图上，重新绘制图表
        this.canvas.style.cursor = 'all-scroll'
      }
      this.ctx.fillStyle = color
      this.ctx.fill()
      this.ctx.closePath()
    },
    // 监听键盘左右键
    drawKeyCode () {
      document.getElementById('kline').addEventListener('keydown', e => {
        if (e.keyCode === 37) {
          // 向左
          // 大概就是将K线图的X坐标向左移动一个柱状图的距离（-cWidth）
        } else if (e.keyCode === 49) {
          // 向右
          // 向左
          // 大概就是将K线图的X坐标向左移动一个柱状图的距离（+cWidth）
        }
      })
    },
    drawDragBar () {
      this.drawRect(
        this.originX,
        this.originY + this.cSpace,
        this.cWidth,
        this.cMargin,
        false,
        '#E8E4F0'
      )
      this.drawRect(
        this.originX,
        this.originY + this.cSpace,
        this.dragBarX - this.originX,
        this.cMargin,
        false,
        '#BCCEF5'
      )
      this.drawRect(
        this.dragBarX,
        this.originY + this.cSpace,
        this.dragBarWidth,
        this.cMargin,
        false,
        '#078ACB',
        false,
        true
      )

      // 监听拖拽
      this.canvas.onmousedown = e => {
        if (this.canvas.style.cursor !== 'all-scroll') {
          return false
        }

        document.onmousemove = e => {
          e = e || window.event
          if (e.offsetX || e.offsetX === 0) {
            this.dragBarX = e.offsetX * 2 - this.dragBarWidth / 2
          } else if (e.layerX || e.layerX === 0) {
            this.dragBarX = e.layerX * 2 - this.dragBarWidth / 2
          }

          if (this.dragBarX <= this.originX) {
            this.dragBarX = this.originX
          }
          if (this.dragBarX > this.originX + this.cWidth - this.dragBarWidth) {
            this.dragBarX = this.originX + this.cWidth - this.dragBarWidth
          }

          var nb = Math.ceil(
            this.dataArr.length *
              ((this.dragBarX - this.cMargin - this.cSpace) / this.cWidth)
          )
          this.showArr = this.dataArr.slice(0, nb || 1)

          // 柱状图信息
          this.tobalBars = this.showArr.length
          this.bWidth = parseInt(this.cWidth / this.tobalBars / 3)
          this.bMargin = parseInt(
            (this.cWidth - this.bWidth * this.tobalBars) / (this.tobalBars + 1)
          )
        }

        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
.kline-container {
  width: 1200px;
  height: 500px;
  margin: 30px;
  position:relative;
}
#x_div,
#y_div {
  position: absolute;
  top: 40px;
  left: 70px;
  background-color: #ccc;
  width: 1090px;
  height: 2px;
}

#y_div {
  height: 360px;
  width: 2px;
}

#Mouse {
  position: absolute;
  display: none;
  color: #000;
}

#Mouse strong {
  color: #f00;
}
</style>
