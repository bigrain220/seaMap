<template>
    <div class="mooring-detail">
        <base-echart
                :id="id"
                :ref="id"
        />
    </div>
</template>

<script>
  import baseEchart from "@/components/content/echarts/baseEchart";
  /*漂移趋势图*/
  export default {
    name: "MooringDetail",
    components: {
      baseEchart,
    },
    props: {
      id: {
        type: String,
        default: 'appDepAngleChart'
      },
      title: {
        type: String,
        default: "靠泊趋势-角度",
      }
    },
    mounted(){
      this.init();
    },
    methods: {
      setOption(option) {
        this.$refs[this.id].setOption(option);
      },
      init() {
        const {title} = this;
        const options = {
          title: {text: title,x:'center'},
          tooltip: {trigger: 'axis'},
          xAxis: {name: '时间', type: 'time'},
          yAxis: [
            {name: '角度', type: 'value', position: 'left'},
          ],
          grid:{
            // left: '2%',right:'2%'
          },
          series: [
            {type: 'line', name: '角度', yAxisIndex: 0},
          ]
        };
        this.setOption(options);
      },
      /**
       *
       * @param values [[时间戳,值]...]
       */
      setChartData(values) {
        const series = [
          {name: '角度', data: values},
        ];
        this.setOption({series});
      }
    }
  }
</script>

<style scoped>

</style>