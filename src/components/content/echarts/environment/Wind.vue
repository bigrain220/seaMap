<template>
  <gauge
      :title="title"
      :unit="'m/s'"
      :value="speed"
      :value-max="maxSpeed"
      :value-min="minSpeed"
      class="wind-gauge"
  />
</template>

<script>
import gauge from '@/components/content/echarts/ConeallGauge'
import {scaleThreshold} from 'd3-scale';
import {deleteObj} from "@/util/content";

export default {
  name: "Wind",
  components: {
    gauge
  },
  props: {
    speed: {
      type: Number
    },
    dir: {
      type: Number
    }
  },
  data() {
    return {
      minSpeed: 0,//最小风速
      maxSpeed: 50,//最大风速
      range: {
        level: scaleThreshold()
            .domain([0.2, 1.5, 3.3, 5.4, 7.9, 10.7, 13.8, 17.1, 20.7, 24.4, 28.4, 32.6, 36.9, 41.4, 46.1, 50.9, 56])
            .range([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]),
        dir: scaleThreshold()
            .domain([11.25, 78.75, 101.25, 168.75, 191.25, 258.75, 281.25, 348.75, 360])
            .range(['北', '东北', '东', '东南', '南', '西南', '西', '西北', '北'])
      },
    }
  },
  computed: {
    title() {
      const {speed, dir} = this;
      const {level, dir: dS} = this.range;
      return `${dS(dir ?? undefined)?.concat("风") ?? '风向'}  ${level(speed ?? undefined)?.toString().concat("级") ?? '风速'}`;
    },
  },
  beforeDestroy() {
    this.dispose();
  },
  methods: {
    dispose() {
      deleteObj(this.$data);
    },
  }
}
</script>

<style scoped>
.wind-gauge {
  top: 10%;
  height: 90%;
}
</style>