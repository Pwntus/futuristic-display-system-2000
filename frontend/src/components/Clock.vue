<template lang="pug">
#clock
  span {{ displayTime }}
</template>

<script>
import moment from 'moment'

export default {
  name: 'Clock',
  data: () => ({
    timer: null,
    displayTime: ''
  }),
  methods: {
    updateTime () {
      this.displayTime = moment().format('HH:mm')
    }
  },
  mounted () {
    this.timer = setInterval(this.updateTime, 1000)
    this.updateTime()
  }
}
</script>

<style lang="stylus">
#clock
  position absolute
  background rgba(255, 255, 255, .15)
  top 0
  right 0
  padding 0 40px
  font-size 60px
  color #FFF
  z-index 100
</style>