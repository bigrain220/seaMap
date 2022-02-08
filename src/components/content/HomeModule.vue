<template>
  <div class="home-module">
    <div class="title">
      <slot name="title"></slot>
    </div>
    <div class="msg">
      <slot name="msg"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeModule",

}
</script>

<style scoped>
.home-module {
  border: 1px solid #353941;
  padding: 5% 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.home-module .title {
  color: #6c6f72 !important;
  text-align: center;
}

.home-module .msg {
  text-align: center;
  height: 100%;
  justify-content: center;
  display: flex;
  flex-direction: column;
}

</style>