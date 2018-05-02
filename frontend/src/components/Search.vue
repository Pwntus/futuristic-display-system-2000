<template lang="pug">
#search
  md-autocomplete.md-primary(
    v-model="selected"
    :md-options="courses"
    @md-changed="getCourses"
    @md-opened="getCourses"
    md-layout="box"
  )
    label Search Courses

  md-button.md-raised.add(
    v-if="selected"
    @click="add"
  ) Add
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
          this.courses = res.data
        })
        .catch(err => {
          console.error(err)
        })
    }, 1000)
  },
  methods: {
    async add () {
      let subject = this.selected
      this.selected = ''

      let status = await this.$store.dispatch('addSubject', subject)
      if (status !== 200)
        console.error('Failed to add subject')
    }
  }
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine";
@include md-register-theme("default", (
  theme: light
));
@import "~vue-material/dist/theme/all";

#search {
  margin-bottom: 20px;

  .add {
    margin: 0;
    width: 100%;
    background: #26C6DA;
    color: #FFF;
  }
}
</style>
