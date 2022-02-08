<template>
  <div class="ship-detail-box">
    <div class="ship-shape" ref="shipShape">
      <canvas id="myCanvas" width="200" height="500" style="background:#0576dc;"></canvas>
    </div>
  </div>

</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      warp: {
        width: 0,
        height: 0,
      },
      arcArr: [
        //传入x,y的都是中心点,rx,ry是半径或者矩形边长的一半
        {
          arc: { x: 62, y: 112, rx: 22, ry: 22, sAngle: 0, eAngle: 2 * Math.PI },
          rect: { width: 24, height: 16, nums: 4, align: "bottom", borderWidth: 1, margin: 2 },
        },
        {
          arc: { x: 162, y: 92, rx: 22, ry: 22, sAngle: 0, eAngle: 2 * Math.PI },
          rect: { width: 24, height: 16, nums: 3, align: "top", borderWidth: 1, margin: 2 },
        },
        {
          arc: { x: 262, y: 76, rx: 22, ry: 22, sAngle: 0, eAngle: 2 * Math.PI },
          rect: { width: 24, height: 16, nums: 3, align: "top", borderWidth: 1, margin: 2 },
        },
        {
          arc: { x: 344, y: 136, rx: 16, ry: 18, sAngle: "", eAngle: "" },
          rect: { width: 24, height: 16, nums: 2, align: "bottom", borderWidth: 1, margin: 2 },
        },
        {
          arc: { x: 400, y: 143, rx: 12, ry: 12, sAngle: "", eAngle: "" },
          rect: { width: 24, height: 16, nums: 2, align: "bottom", borderWidth: 1, margin: 2 },
        },
        //中间点关系到船的定位
        {
          arc: { x: 500, y: 124, rx: 34, ry: 20, sAngle: "", eAngle: "" },
          rect: { width: 24, height: 16, nums: 0, align: "bottom", borderWidth: 1, margin: 2 },
        },
        {
          arc: { x: 600, y: 143, rx: 12, ry: 12, sAngle: "", eAngle: "" },
          rect: { width: 24, height: 16, nums: 2, align: "bottom", borderWidth: 1, margin: 2 },
        },
        {
          arc: { x: 656, y: 136, rx: 16, ry: 18, sAngle: "", eAngle: "" },
          rect: { width: 24, height: 16, nums: 2, align: "bottom", borderWidth: 1, margin: 2 },
        },
        {
          arc: { x: 738, y: 76, rx: 22, ry: 22, sAngle: 0, eAngle: 2 * Math.PI },
          rect: { width: 24, height: 16, nums: 3, align: "top", borderWidth: 1, margin: 2 },
        },
        {
          arc: { x: 820, y: 92, rx: 22, ry: 22, sAngle: 0, eAngle: 2 * Math.PI },
          rect: { width: 24, height: 16, nums: 3, align: "top", borderWidth: 1, margin: 2 },
        },
        {
          arc: { x: 920, y: 112, rx: 22, ry: 22, sAngle: 0, eAngle: 2 * Math.PI },
          rect: { width: 24, height: 16, nums: 4, align: "bottom", borderWidth: 1, margin: 2 },
        },
      ],
    };
  },
  methods: {
    init(params = {}) {
      // console.log(this.warp)
      var c = document.getElementById("myCanvas");
      c.width = params.width;
      c.height = params.width / 1020 * 400  //自定义
      var ctx = c.getContext("2d");
      ctx.scale(params.width / 1020, params.width / 1020);
      this.arcArr.map((item, index) => {
        // console.log(item)
        ctx.beginPath();
        let { x, y, rx, ry, sAngle, eAngle } = item.arc;
        if (sAngle === 0) {
          ctx.arc(x, y, rx, sAngle, eAngle);
        } else {
          ctx.rect(x - rx, y - ry, rx * 2, ry * 2);
        }
        ctx.fillStyle = "#c4ccfd"; //设置填充颜色
        ctx.fill(); //开始填充
        ctx.strokeStyle = "#2c5e9b"; //将线条颜色设置为蓝色
        ctx.stroke();
        //矩形数据
        let { width, height, nums, align, borderWidth, margin } = item.rect;
        let temNum = parseInt(nums / 2);
        //如果居中
        ctx.textAlign = "center";
        let centerOtionWidth = 0.4 * width;
        //如果不居中
        // let centerOtionWidth = 0;
        for (let i = 0; i < nums; i++) {
          if (align === "bottom") {
            if (nums % 2 === 0) {
              ctx.rect(x - temNum * width, y + ry + margin, width, height);
              ctx.fillRect(x - temNum * width + borderWidth, y + ry + margin + borderWidth, width - borderWidth, height - borderWidth);
              ctx.strokeText('0' + "", x - temNum * width + centerOtionWidth + borderWidth + 2, y + ry + margin + borderWidth + height - 4);
            } else {
              ctx.rect(x - ((temNum + 0.5) * width), y + ry + margin, width, height);
              ctx.fillRect(x - (temNum + 0.5) * width + borderWidth, y + ry + margin + borderWidth, width - borderWidth, height - borderWidth);
              ctx.strokeText('422' + "", x - (temNum + 0.5) * width + centerOtionWidth + borderWidth + 2, y + ry + margin + borderWidth + height - 4);
            }
          } else {
            if (nums % 2 === 0) {
              ctx.rect(x - temNum * width, y - ry - height - margin, width, height);
              ctx.fillRect(x - temNum * width + borderWidth, y - ry - height - margin + borderWidth, width - borderWidth, height - borderWidth);
              ctx.strokeText('422' + "", x - temNum * width + centerOtionWidth + borderWidth + 2, y - ry - height - margin + borderWidth + height - 4);
            } else {
              ctx.rect(x - ((temNum + 0.5) * width), y - ry - height - margin, width, height);
              ctx.fillRect(x - (temNum + 0.5) * width + borderWidth, y - ry - height - margin + borderWidth, width - borderWidth, height - borderWidth);
              ctx.strokeText('422' + "", x - (temNum + 0.5) * width + centerOtionWidth + borderWidth + 2, y - ry - height - margin + borderWidth + height - 4);
            }
          }
          temNum--;
        }
        ctx.stroke();
        ctx.textAlign = "start";
        //连接线
        const lineW1 = 4;
        ctx.lineCap = "round";
        ctx.lineWidth = lineW1;
        ctx.beginPath();
        if (index < this.arcArr.length - 1 && ![3, 4, 5, 6, 7].includes(index)) {
          //默认
          if (sAngle === 0) {
            ctx.moveTo(x, y);
            ctx.lineTo(this.arcArr[index + 1].arc.x, this.arcArr[index + 1].arc.y);
            ctx.stroke();
            // console.log({1:{x,y},2:{x:this.arcArr[index+1].arc.x,y:this.arcArr[index+1].arc.y}})
            // ctx.moveTo(62,112);
            // ctx.lineTo(162,92);
            // ctx.stroke();
          } else {
            ctx.moveTo(x, y);
            ctx.lineTo(this.arcArr[index + 1].arc.x, this.arcArr[index + 1].arc.y);
            ctx.stroke();
          }
        } else {
          //自定义
          ctx.lineCap = "butt";
          if (index === 3) {
            ctx.moveTo(x + rx, this.arcArr[index + 1].arc.y - this.arcArr[index + 1].arc.ry + lineW1 / 2);
            ctx.lineTo(this.arcArr[index + 1].arc.x - this.arcArr[index + 1].arc.rx, this.arcArr[index + 1].arc.y - this.arcArr[index + 1].arc.ry + lineW1 / 2);
          }
          if (index === 4) {
            ctx.moveTo(x + rx, y - ry + lineW1 / 2);
            ctx.lineTo(this.arcArr[index + 1].arc.x, y - ry + lineW1 / 2);
          }
          if (index === 5) {
            ctx.moveTo(x + rx, this.arcArr[index + 1].arc.y - this.arcArr[index + 1].arc.ry + lineW1 / 2);
            ctx.lineTo(this.arcArr[index + 1].arc.x - this.arcArr[index + 1].arc.rx, this.arcArr[index + 1].arc.y - this.arcArr[index + 1].arc.ry + lineW1 / 2);
          }
          if (index === 6) {
            ctx.moveTo(x + rx, y - ry + lineW1 / 2);
            ctx.lineTo(this.arcArr[index + 1].arc.x - this.arcArr[index + 1].arc.rx, y - ry + lineW1 / 2);
          }
          if (index === 7) {
            ctx.lineCap = "square";
            ctx.moveTo(x + rx, y - 0.5 * ry);
            ctx.lineTo(this.arcArr[index + 1].arc.x, this.arcArr[index + 1].arc.y);
          }
        }
        ctx.strokeStyle = "#9196cd";
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.lineCap = "butt";
      });
      this.shipInit(ctx);
    },
    shipInit(ctx) {
      ctx.beginPath();
      //船体
      ctx.lineCap = "round";
      ctx.lineWidth = 180;
      ctx.strokeStyle = "#1095f0";
      ctx.scale(1, 0.4);
      ctx.moveTo(320, 530);
      ctx.lineTo(680, 530);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.scale(1, 2.5)
      //船左侧
      ctx.beginPath();
      ctx.fillStyle = "#0576dc";
      ctx.fillRect(164, 168, 90, 72);
      ctx.stroke();
      ctx.fillStyle = "#fff";
      // //船里面
      ctx.beginPath();
      ctx.strokeStyle = "#649de2";
      ctx.rect(306, 177, 10, 20);
      ctx.rect(297, 177 + 20, 28, 32);
      ctx.rect(306, 177 + 52, 10, 18);
      ctx.stroke();
      ctx.strokeStyle = "#fff";
      //连接线
      const lineSpace = 10; const startX = 370; const startY = 200; const startWidth = 110; const startHeight = 70;
      ctx.beginPath();
      ctx.strokeStyle = "#999";
      [1, 2, 3].map((item, index) => {
        ctx.moveTo(startX, startY + index * lineSpace);
        ctx.lineTo(startX + startWidth + index * lineSpace, startY + index * lineSpace);
        ctx.lineTo(startX + startWidth + index * lineSpace, startY - startHeight);
      })
      ctx.stroke();
      ctx.strokeStyle = "#fff";
      //船下文字
      ctx.strokeStyle = "#2c5e9b";
      const centerX = 490, centerY = 270, height = 20, width = 180, spaceHeight = 4;
      const leftW = 50, centerW = 80, rightW = 50;//左中右布局宽度 加起来要等于上面的width
      ctx.beginPath();
      ctx.fillStyle = "#d2f7ff"; //设置填充颜色
      ctx.fill(); //开始填充
      //1
      ctx.fillText("测试文字", centerX - width, centerY);
      ctx.fillRect(centerX - centerW - rightW, centerY - 0.75 * height, centerW, height);
      ctx.strokeText('422000', centerX - centerW - rightW + 4, centerY);
      ctx.textAlign = "center";
      ctx.fillText("cm", centerX - rightW * 0.5, centerY);
      ctx.textAlign = "start";
      //2
      let secondColWidth = centerX + 40;
      ctx.fillText("测试文字", secondColWidth, centerY);
      ctx.fillRect(secondColWidth + leftW, centerY - 0.75 * height, centerW, height);
      ctx.strokeText('422000', secondColWidth + leftW + 4, centerY);
      ctx.textAlign = "center";
      ctx.fillText("cm", secondColWidth + width - rightW * 0.5, centerY);
      ctx.textAlign = "start";
      //3
      let secondRowHeight = height + spaceHeight;
      ctx.fillText("测试文字", centerX - width, centerY + secondRowHeight);
      ctx.fillRect(centerX - centerW - rightW, centerY - 0.75 * height + secondRowHeight, centerW, height);
      ctx.strokeText('422000', centerX - centerW - rightW + 4, centerY + secondRowHeight);
      ctx.textAlign = "center";
      ctx.fillText("ccm/s", centerX - rightW * 0.5, centerY + secondRowHeight);
      ctx.textAlign = "start";
      //4
      ctx.fillText("测试文字", secondColWidth, centerY + secondRowHeight);
      ctx.fillRect(secondColWidth + leftW, centerY - 0.75 * height + secondRowHeight, centerW, height);
      ctx.strokeText('422000', secondColWidth + leftW + 4, centerY + secondRowHeight);
      ctx.textAlign = "center";
      ctx.fillText("ccm/s", secondColWidth + width - rightW * 0.5, centerY + secondRowHeight);
      ctx.textAlign = "start";
      ctx.strokeStyle = "#fff";
      //左侧文字
      const leftLineX = 70; const leftlineY = 190; const lineHeight = 20;
      ctx.textAlign = "center";
      ctx.fillStyle = "#bdf4d5";
      const leftlineData = [{ text: "测试文字" }, { text: "测试文字111" }, { text: "测试文字111" }, { text: "测试文字" }, { text: "测试文字" }, { text: "测试文字" }, { text: "测试文字" }];
      leftlineData.map((item, index) => {
        ctx.fillText(item.text, leftLineX, leftlineY + index * lineHeight);
      })
      ctx.textAlign = "start";
      ctx.fillStyle = "#fff";
      //右侧文字
      const rightLineX = 900; const rightlineY = 200;
      const rightRectWidth = 24; const rightRectHeight = 14;
      ctx.textAlign = "center";
      const arr = [{ text: '测试文字', color: '#b8cef5' }, { text: '一二三四五六', color: '#92e03e' }, { text: '666', color: '#ceaff2' }, { text: '666', color: '#d510d2' }, { text: '666', color: '#c9ecc2' }, { text: '666', color: '#5ec1fa' }]
      arr.map((item, index) => {
        ctx.fillText(item.text, rightLineX, rightlineY + index * lineHeight);
        ctx.fillStyle = item.color;
        ctx.fillRect(rightLineX + 50, rightlineY - 0.75 * rightRectHeight + (index * 1.42) * rightRectHeight, rightRectWidth, rightRectHeight);
        ctx.fillStyle = "#fff";
      })
      ctx.textAlign = "start";
    },
  },
  mounted() {
    // const resizeObserver = new ResizeObserver((entries) => {
    //   let { height, left, right, top, width, x, y } = entries[0].contentRect;
    //   this.warp = { height, left, right, top, width, x, y };
    // });
    // resizeObserver.observe(this.$refs.shipShape);
    var _this = this;
    _this.warp.width = _this.$refs.shipShape.clientWidth;
    window.onresize = () => {
      _this.warp.width = _this.$refs.shipShape.clientWidth;
      _this.warp.height = _this.$refs.shipShape.clientHeight;
    }
  },
  beforeDestroy() {
    window.onresize = null;
  },
  watch: {
    "warp.width": {
      deep: true,
      handler: function (newV, oldV) {
        this.init({ width: newV });
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.ship-detail-box {
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  overflow: hidden;
  background: #0576dc;
  .title {
    font-size: 16px;
    line-height: 20px;
    height: 20px;
    margin: 20px 0;
    text-align: center;
    font-weight: bold;
    color: #fff;
  }
  .ship-shape {
    width: 100%;
  }
}
</style>