<template>
    <div>
        <el-drawer
                :title="title"
                :visible.sync="$store.state.navMenuDrawerVisible"
                :with-header=false
                direction="ltr"
                size="12rem"
        >
            <nav-menu/>
        </el-drawer>
    </div>
</template>

<script>
    import NavMenu from "@/views/aside/NavMenu";
    import {deleteObj} from "@/util/content";

    export default {
        name: "NavMenuDrawer",
        components: {
            NavMenu
        },
        data() {
            return {
                title: this.$store.state.navMenuTitle,
            }
        },
        computed: {},
      beforeDestroy() {
        deleteObj(this.$data);
      },
    }
</script>

<style scoped>

</style>
