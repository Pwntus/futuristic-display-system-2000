<template lang="pug">
#app
  router-view
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine";
body, #app {
  height: 100%;
}

body:after {
  content: "";
  display: block;
  background-attachment: fixed;
  position: fixed;
  top: 0; left: 0;
  height: 100%;
  width: 100%;
  background: md-get-palette-color(cyan, 700);
  z-index:-1;   
}
</style>
