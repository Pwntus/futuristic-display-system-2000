<template lang="pug">
.md-layout.md-alignment-center-center#login(v-if="!$store.getters.cid")
  .md-layout-item.md-size-25.md-xsmall-size-100.md-small-size-50.md-medium-size-50.md-large-size-33.md-xlarge-size-25

    md-card.md-primary.md-elevation-0
      md-card-header
        .md-title Provide Card Number
      md-card-content
        | The Student Card Number is located at the back of the card
        md-field
          label 10-digit number
          md-input(
            v-model="cid"
            maxlength="10"
            @keyup.enter.native="submit"
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
      this.$store.dispatch('getSubjects')
    }
  }
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine";
@include md-register-theme("default", (
  primary: md-get-palette-color(white, 500),
  theme: dark
));
@import "~vue-material/dist/theme/all";

#login {
  height: 100%;

  .md-card {
    background: transparent;

    label, .md-count {
      color: rgba(255, 255, 255, 0.7) !important;
    }

    .md-field:after {
      background-color: hsla(0,0%,100%,.7) !important;
    }

    .md-field:before {
      background-color: #FFF !important;
    }

    .md-has-value .md-input {
      -webkit-text-fill-color: rgba(255, 255, 255, 0.87) !important;
    }
  }
}
</style>
