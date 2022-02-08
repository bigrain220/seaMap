<template>
    <div class="current">
        <base-echart
                :id="id"
                :ref="id"
        />
    </div>
</template>

<script>
  import baseEchart from "@/components/content/echarts/baseEchart";

  export default {
    name: "current",
    components: {
      baseEchart
    },
    props: {
      id: {
        type: String,
        required: true
      },
      chartData: {
        type: Array,
        required: true
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      chartData(newValue) {
        this.setChartData(newValue);
      }
    },
    methods: {
      init() {
        let option = {
          title: {text: "多层流速、流向", x: "left"},
          legend: {x: "right", data: ["流向", "流速"]},
          tooltip: {
            show: true, trigger: "axis", axisPointer: {type: "line", axis: "y"},
            formatter: function (params) {
              let current = params[0].data[1];
              let flowDir = params[0].data[0];
              let flowRate = params[1].data[0];
              return "层数：" + current + "<br>"
                + "流向：" + flowDir + " °<br>"
                + "流速：" + flowRate + " cm/s<br>";
            }
          },
          xAxis: [
            {
              name: "流速(cm/s)", type: "value", position: "bottom", offset: 8,
              min: 0, max: 240,
              splitLine: {show: false},
              axisLine: {lineStyle: {color: "#FF6863"}}
            },
            {
              name: "流向(度)", type: "value", position: "bottom", offset: 40,
              min: -360, max: 360,
              splitLine: {show: false},
              axisLine: {lineStyle: {color: "#6EAB40"}}
            }
          ],
          yAxis: [
            {
              type: "value", name: "层数", position: "left", nameLocation: "middle",
              nameGap: 30, min: 0, max: 20, splitLine: {show: false}, splitNumber: 20
            }
          ],
          series: [
            {
              xAxisIndex: 1,
              name: "流向",
              type: "line",
              itemStyle: {color: "#6EAB40"},
              // data: [[100, 1], [150, 2], [120, 3], [110, 4], [180, 5], [120, 6], [150, 7], [120, 8], [130, 9], [180, 10], [140, 11], [150, 12], [120, 13], [160, 14], [108, 15], [170, 16], [150, 17], [102, 18], [200, 19], [108, 20]]
            },
            {
              xAxisIndex: 0,
              name: "流速",
              type: "line",
              itemStyle: {color: "#FF6863"},
              // data: [[10, 1], [15, 2], [12, 3], [10, 4], [18, 5], [10, 6], [15, 7], [12, 8], [10, 9], [18, 10], [10, 11], [15, 12], [12, 13], [10, 14], [18, 15], [10, 16], [15, 17], [12, 18], [10, 19], [18, 20]]
            }
          ]
        };
        this.setOption(option);
      },
      setOption(option) {
        this.$refs[this.id].setOption(option);
      },
      /**
       * 数组  values[0]为流速的数据   values[1]为流向的数据
       * @param values
       */
      setChartData(values) {
        let flowRate = values[0];
        let direction = values[1];
        let option = {series: [{data: direction}, {data: flowRate}]};
        this.setOption(option);
      }
    }
  }
</script>

<style scoped>

</style>