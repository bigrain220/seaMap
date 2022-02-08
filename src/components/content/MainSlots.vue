<template>
  <div class="home-slots">
    <div class="slot-main">
      <slot name="main"></slot>
    </div>
    <div class="home-menu-main">
      <slot name="home-menu"></slot>
    </div>
  </div>
</template>

<script>
import HomeMenu from "@/components/content/HomeMenu";
import HomePanel from "@/components/content/HomePanel";
import VesselManager from "@/views/main/vesselManager";

export default {
  name: "MainSlots",
  components: {HomePanel, HomeMenu, VesselManager},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
.home-slots {
  height: 100%;
  display: grid;
  grid-gap: 6px;
  grid-template-columns: auto 12rem;
  grid-template-areas: "m sb";
}

.home-slots .slot-main {
  grid-area: m;
}

.home-slots .home-menu-main {
  grid-area: sb;
}

</style>