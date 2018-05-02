<template lang="pug">
#search
  md-autocomplete(
    v-model="selected"
    :md-options="courses"
    @md-changed="getCourses"
    @md-opened="getCourses"
    md-layout="box"
  )
    label Search Courses
</template>

<script>
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'Search',
  data: () => ({
    selected: null,
    courses: [],
    getCourses: null
  }),
  created () {
    this.getCourses = _.debounce(searchTerm => {
      if (!searchTerm)
        return

      const term = searchTerm.toLowerCase()
      axios.get(`http://localhost:3002/search/${term}`)
        .then(res => {
          console.log('GOT', res.data)
          this.courses = res.data
        })
    }, 1000)
  }
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine";
@include md-register-theme("default", (
  primary: md-get-palette-color(cyan, 700),
  theme: light
));
@import "~vue-material/dist/theme/all";
#search {
}
</style>
