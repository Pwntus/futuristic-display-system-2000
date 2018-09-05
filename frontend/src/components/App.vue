<template lang="pug">
v-app
  clock
  router-view
</template>

<script>
import Clock from '@/components/Clock'

export default {
  name: 'App',
  components: { Clock }
}
</script>

<style lang="stylus">
.application
  background transparent !important
</style>