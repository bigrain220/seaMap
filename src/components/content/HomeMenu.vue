<template>
  <div class="home-menu">
    <home-panel class="op op1 management">
      <div v-on:click="handler($event,'management')">
        MANAGEMENT
      </div>
    </home-panel>
    <home-panel class="op op2 operator">
      <div v-on:click="handler($event,'operator')">
        OPERATOR
      </div>
    </home-panel>
    <home-panel class="op op3 history">
      <div v-on:click="handler($event,'history')">
        HISTORY REPLAY
      </div>
    </home-panel>
    <home-panel class="op op4 report">
      <div v-on:click="handler($event,'report')">
        REPORT
      </div>
    </home-panel>
    <home-panel class="op op5 setting">
      <div v-on:click="handler($event,'setting')">
        SETTING
      </div>
    </home-panel>
  </div>
</template>

<script>
import HomePanel from "@/components/content/HomePanel";

export default {
  name: "HomeMenu",
  model: {},
  components: {HomePanel},
  computed: {
    activeIndex: {
      get() {
        return this.$route.path.split('/')[2];
      },
      set(value) {
        this.addActive(value);
      }
    },
  },
  mounted() {
    this.activeIndex = this.$route.path.split('/')[2];
  },
  watch: {
    activeIndex(value) {
      this.removeAllActive();
      this.addActive(value)
    },
  },
  methods: {
    handler($event, path) {
      this.$emit("show", `/home/${path}`);
    },
    removeAllActive() {
      document.querySelectorAll('.home-menu > .op.active').forEach(item => item.classList.remove("active"));
    },
    addActive(value) {
      document.querySelector(`.home-menu > .op.${value}`)?.classList?.add('active')
    }
  }
}
</script>

<style scoped>
.home-menu {
  display: grid;
  grid-gap: 6px;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(5, 1fr);
}

.op1 {
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 2;
}

.op2 {
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 2;
  grid-row-end: 3;
}

.op3 {
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 3;
  grid-row-end: 4;
}

.op4 {
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 4;
  grid-row-end: 5;
}

.op5 {
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 5;
  grid-row-end: 6;
}

/*垂直居中*/
.op {
  height: 100%;
  color: #4e4f52;
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  display: table;
  transition: all 0.1s ease-in-out;
}

.op > div {
  vertical-align: middle;
  display: table-cell;
}

.op:hover {
  background: rgba(255, 255, 255, 0.6) !important;
}

.op.active {
  background: #6c6f72;
  color: #2c3037;
}
</style>