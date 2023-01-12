<template>
  <div id="app">
    <root-view title="Active User Interface" />
  </div>
</template>

<script>
import { RootView } from "./components";

export default {
  name: "App",
  components: {
    "root-view": RootView
  },
  mounted: function() {
    this.onDisableMiddleClick();
  },
  methods: {
    onDisableMiddleClick: function() {
      document.body.onmousedown = function(event) {
        if (event.button === 1) return false;
      };
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
