<template>
  <div class="main-home">
    <Header/>
    <router-view/>
  </div>
</template>

<script>
import Header from "@/views/header/Header";
import {dockingWebSocket, environmentWebsocket} from "@/network/websocketList";

export default {
  name: "MainHome",
  components: {Header},
  data() {
    return {
      socket: {
        docking: null,
        env: null,
        warn: null,
      }
    }
  },
  created() {
    this.$store.dispatch('berth/setup').then((berths) => {
      const socket = dockingWebSocket();
      socket.onopen = () => this.$store.dispatch('docking/onOpen', {socket, berths});
      socket.onmessage = (msg) => this.$store.dispatch('docking/onMessage', msg);
      this.socket.docking = socket;
    })
    this.$store.dispatch('env/setup').then((env) => {
      const socket = environmentWebsocket();
      socket.onopen = () => this.$store.dispatch('env/onOpen', {socket, id: env.map(e => e.id)});
      socket.onmessage = (msg) => this.$store.dispatch('env/onMessage', msg);
      this.socket.env = socket;
    });
  },
}
</script>

<style scoped>
.main-home {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  flex-direction: column;
  display: flex;
}
</style>