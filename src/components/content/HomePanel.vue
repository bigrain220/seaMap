<template>

  <div class="home-panel">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "HomePanel"
}
</script>

<style scoped>
.home-panel {
  display: flex;
  position: relative;
  flex-direction: column;
  user-select: none;
  background: #2c3037;
  color: #01bfff;
  border: 1px solid #4f5560;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

</style>