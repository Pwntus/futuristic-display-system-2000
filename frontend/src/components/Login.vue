<template lang="pug">
.md-layout.md-alignment-center-center#login(v-if="!$store.getters.cid")
  .md-layout-item.md-xsmall-size-100.md-small-size-50.md-medium-size-50.md-large-size-33.md-xlarge-size-25

    md-card.md-primary.md-elevation-0
      md-card-header
        .md-title Provide Card Number
      md-card-content
        | The Student Card Number is located at the back of the card
        md-field
          md-input(
            v-model="cid"
            maxlength="10"
          )
      md-card-actions
        md-button(@click="submit") Ok
</template>

<script>
export default {
  name: 'Login',
  data: () => ({
    cid: null
  }),
  methods: {
    submit () {
      // TODO: assert correct format
      this.$store.commit('setCid', this.cid)
    }
  }
}
</script>

<style lang="scss" scoped>
#login {
  height: 100%;
}
</style>
