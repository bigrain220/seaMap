<template>
  <div style="height: 100%;width: inherit;">
    <single-docking
        id="singleDocking1"
        ref="singleDocking1"
        :cable-tension-options="cableOptions"
        :swiper-options="slideItemOptions"/>
  </div>
</template>
<script>
import singleDocking from "@/components/content/singleDocking";

export default {
  name: "multiDocking",
  components: {
    singleDocking,
  },
  data() {
    return {
      slideItemOptions: {min: -2, max: 2.5, precision: 0.02},
      cableOptions: [
        {cableNum: 4, waring: 50, alert: 75},
        {cableNum: 3, waring: 50, alert: 75},
        {cableNum: 3, waring: 50, alert: 75},
        {cableNum: 2, waring: 50, alert: 75},
        {cableNum: 2, waring: 50, alert: 75},
        {cableNum: 2, waring: 50, alert: 75},
        {cableNum: 2, waring: 50, alert: 75},
        {cableNum: 3, waring: 50, alert: 75},
        {cableNum: 3, waring: 50, alert: 75},
        {cableNum: 4, waring: 50, alert: 75},
      ],
      berth: {},
      webSocketObj: null,
    }
  }
}
</script>
