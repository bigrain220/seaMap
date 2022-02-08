<template>
    <div class="wave">
        <base-echart
                :id="id"
                :ref="id"
        />
    </div>
</template>

<script>
    import baseEchart from "@/components/content/echarts/baseEchart";
  export default {
    name: "wave",
    components:{
      baseEchart
    },
    props:{
      id:{
        type:String,
        required:true
      },
      chartData:{
        type: Array,
        required: true
      }
    },
    mounted(){
        this.init()
    },
    watch:{
      chartData(newValue){
        this.setChartData(newValue);
      }
    },
    methods:{
      setOption(option){
        this.$refs[this.id].setOption(option);
      },
      init(){
        let option = {
          title: {text: '波浪', x: 'left'},
          legend: {data: ['波高', '周期']},
          tooltip: {trigger: 'axis'},
          xAxis: [
            {name: '高度/m', type: 'value', axisLine: {lineStyle: {color: '#40b4f1'}}},
            {name: '周期/s', type: 'value', axisLine: {lineStyle: {color: '#9c27b0'}}}
          ],
          yAxis: [
            {type: "category", data: ['长\n波\n浪', '短\n波\n浪', '有\n效\n波\n浪']}
          ],
          series: [
            {
              name: '波高', xAxisIndex: 0, type: 'bar',
              label: {show: true},
              itemStyle: {color: '#40b4f1'},
              // data: [0, 0, 0]
            },
            {
              name: '周期', xAxisIndex: 1, type: 'bar',
              label: {show: true},
              itemStyle: {color: '#9c27b0'},
              // data: [0, 0, 0],
            }
          ]
        };
        this.setOption(option);
      },
      /**
       * 数组 从0-5依次为sigWaveHigh, sigWavePeriod, longWaveHigh, longWavePeriod, shortWaveHigh, shortWavePeriod
       * @param values
       */
      setChartData(values){
        let sigWaveHigh = values[0];
        let sigWavePeriod = values[1];
        let longWaveHigh = values[2];
        let longWavePeriod = values[3];
        let shortWaveHigh = values[4];
        let shortWavePeriod = values[5];
        this.setOption({
          series: [{
            name: '波高',
            data: [shortWaveHigh, longWaveHigh, sigWaveHigh]
          }, {
            name: '周期',
            data: [shortWavePeriod, longWavePeriod, sigWavePeriod]
          }]
        });
      }
    }
  }
</script>

<style scoped>

</style>