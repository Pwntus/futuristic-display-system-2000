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
  top 0
  right 0
  padding-right 10px
  font-size 70px
  color #FFF
  z-index 100
</style>