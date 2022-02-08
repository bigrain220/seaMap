<template>
  <gauge
      :title="'大气温度'"
      :unit="'℃'"
      :value="temperature"
      :value-max="max"
      :value-min="min"
      class="temperature-gauge"
  />
</template>

<script>
import gauge from '@/components/content/echarts/ConeallGauge'
import {deleteObj} from "@/util/content";

export default {
  name: "Temperature",
  components: {
    gauge
  },
  props: {
    temperature: {
      type: Number
    },
  },
  data() {
    return {
      min: 0,
      max: 50,
    }
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
.temperature-gauge {
  top: 10%;
  height: 90%;
}
</style>