<template lang="pug">
#view-app
  login
  dashboard
</template>

<script>
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'

export default {
  name: 'ViewApp',
  components: {
    Login,
    Dashboard
  }
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine";
@include md-register-theme("default", (
  primary: md-get-palette-color(cyan, 700),
  theme: dark
));
@import "~vue-material/dist/theme/all";

#view-app {
  height: 100%;
  padding: 15px;
}
</style>
