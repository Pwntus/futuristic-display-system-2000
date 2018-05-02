<template lang="pug">
#app
  login
  dashboard
</template>

<script>
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'

export default {
  name: 'App',
  components: {
    Login,
    Dashboard
  },
  computed: {
    subjects () {
      //await this.$store.dispatch('getSubjects', '0123456789')
      return this.$store.getters.subjects
    }
  },
  mounted () {
    //this.$store.dispatch('getSubjects', '0123456789')
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

body {
  height: 100%;
}

#app {
  height: 100%;
  padding: 15px;
  background: md-get-palette-color(cyan, 700);
}
</style>
