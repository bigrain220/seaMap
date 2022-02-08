<template>
  <gauge
      :title="'降雨量'"
      :unit="'mm'"
      :value="rain"
      :value-max="max"
      :value-min="min"
      class="rain-gauge"
  />
</template>

<script>
import gauge from '@/components/content/echarts/ConeallGauge'
import {deleteObj} from "@/util/content";

export default {
  name: "Rain",
  components: {
    gauge
  },
  props: {
    rain: {
      type: Number
    },
  },
  data() {
    return {
      min: 0,
      max: 100,
    }
  },
  beforeDestroy() {
    this.dispose();
  },
  methods: {
    dispose() {
      deleteObj(this.$data);
    }
  }
}
</script>

<style scoped>
.rain-gauge {
  top: 10%;
  height: 90%;
}
</style>