<template>
    <home-panel>
      
    </home-panel>
</template>

<script>
import HomePanel from "@/components/content/HomePanel";

export default {
  name: "setting",
  components: { HomePanel },
  data() {
    return {};
  },
  computed: {},
  wathch: {},
  mounted() {},
  beforeDestroy() {
    deleteObj(this.$data);
  },
  methods: {},
};
</script>

<style scoped>
</style>
