<template>
  <router-view/>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  background: #1a1d1e;
  color: #77787b;
}

#app {
  height: 100%;
  background: #1a1d1e;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
