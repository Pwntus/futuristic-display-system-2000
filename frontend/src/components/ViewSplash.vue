<template lang="pug">
#view-splash
  #arrow ↙
  v-container(
    fluid
    fill-height
  )
    v-layout.splash(
      align-center
      justify-center
    )
      div
        v-icon texture
        .display-1 Scan Your ID Card
</template>

<script>
export default {
  name: 'ViewSplash'
}
</script>

<style lang="stylus">
#view-splash
  height 100%

  #arrow
    padding 0 0 100px 50px
    position absolute
    left 0
    bottom 0
    color rgba(0, 0, 0, .54)
    font-size 250px

  .splash
    top 0
    left 0
    margin 0 auto
    position relative
    color #01454c
    text-align center

    .icon
      font-size 100px

    .display-1
      margin 20px 0
</style>
