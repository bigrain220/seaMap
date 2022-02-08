<template>
    <div class="el-badge">
        <slot></slot>
        <transition name="el-zoom-in-center">
            <sub
                    v-show="!hidden && (content || isDot)"
                    v-text="content"
                    class="el-badge__content"
                    :class="[
          'el-badge__content--' + type,
          {
            'is-fixed': $slots.default,
            'is-dot': isDot
          }
        ]">
            </sub>
        </transition>
    </div>
</template>

<script>
  /*改了el-badge的样式 把上标改成了下标*/
  export default {
    name: 'subBadge',

    props: {
      value: [String, Number],
      max: Number,
      isDot: Boolean,
      hidden: Boolean,
      type: {
        type: String,
        validator(val) {
          return ['primary', 'success', 'warning', 'info', 'danger'].indexOf(val) > -1;
        }
      }
    },

    computed: {
      content() {
        if (this.isDot) return;

        const value = this.value;
        const max = this.max;

        if (typeof value === 'number' && typeof max === 'number') {
          return max < value ? `${max}+` : value;
        }

        return value;
      }
    }
  };
</script>

<style scoped>
    .el-badge__content.is-fixed {
        top: 17px;
        right: 6px;
    }
</style>
