<template>
</template>

<script>
import {getRoleList} from "@/network/request-api";

export default {
  name: "UserModal",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    editable: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    roleList: Array
  },

  data() {
    return {
      userData: {}
    }
  },
  mounted() {



  },
  methods: {
    open() {
      this.$emit("open");
      console.log(this.user);
      this.userData.username = this.user.username;
      this.userData.roleList = this.user.roles?.map(item => item.id);
    },
    close() {
      this.$emit("close");
    },
    commitUser() {
      console.log(this.user);
      if (this.editable) {
        this.$emit("updateUser", this.user);
      }
      this.close();
    }
  }

}
</script>

<style scoped>

</style>