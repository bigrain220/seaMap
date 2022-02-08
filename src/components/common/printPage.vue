<template>
  <div class="print-page" :class="{landscape:landscape}">
    <div class="page-container">
      <!--页眉-->
      <div class="page-header">
        <!--logo-->
        <img src="~@/assets/img/brand/logo.svg" alt="Coneall">
        <!--居中-->
        <span><slot name="header-center"/></span>
        <!--右侧-->
        <span><slot name="header-right"/></span>
      </div>
      <!--内容-->
      <div class="page-content">
        <slot/>
      </div>
      <!--页脚-->
      <div class="page-footer">
        <slot name="footer">
          <span/>
          <span><slot name="footer-center"/></span>
          <!--页码-->
          <span><slot name="pageNum">{{ page }}</slot></span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "printPage",
  props: {
    //横向显示
    landscape: {
      type: Boolean,
      default: false,
    },
    page: {
      type: Number,
    }
  }
}
</script>

<style>
:root {
  --page-width: 210mm;
  --page-height: 297mm;
  --page-padding: 2mm;
}

body {
  margin: 0 !important;
}
</style>

<style scoped>
.print-page {
  width: var(--page-width);
  height: var(--page-height);
  padding: 0 var(--page-padding);
  box-sizing: border-box;
  user-select: none;
  pointer-events: none;
}

.page-container {
  width: 100%;
  height: 100%;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  gap: .5cm;
}

.page-header {
  line-height: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.page-header img {
  height: 3rem;
}

.page-header span {
  margin-top: 2rem;
}

.page-footer {
  line-height: 1rem;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
}

.page-content {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

@media screen {
  .print-page {
    box-shadow: 0 0 5px 1px rgba(128, 128, 128, 0.3);
    padding: 0.5cm;
  }

  .print-page.landscape {
    width: var(--page-height);
    height: var(--page-width);
  }
}

@media print {
  @page {
    size: A4;
  }

  .print-page {
    display: block;
    page-break-before: always;
    page-break-after: always;
    break-before: page;
    break-after: page;
    position: relative;
    overflow: hidden;
  }

  /**
   * 打印时内部容器翻转
   */
  .landscape > .page-container {
    width: var(--page-height);
    height: calc(var(--page-width) - (var(--page-padding) * 2));
    transform: rotate(90deg) translateY(-100%);
    transform-origin: 0 0;
  }
}
</style>