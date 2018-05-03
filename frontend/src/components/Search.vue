<template lang="pug">
#search
  md-autocomplete.md-primary(
    v-model="selected"
    :md-options="subjects"
    :md-fuzzy-search="false"
    @md-changed="filterSubjects"
    md-layout="box"
  )
    label Search Courses

    template(
      slot="md-autocomplete-item"
      slot-scope="{ item, term }"
    )
      md-highlight-text(
        :md-term="term"
        :md-fuzzy-search="false"
      ) {{ item }}

  md-button.add(
    v-if="selected"
    @click="add"
  ) Add to list
</template>

<script>
import subjects from '@/assets/subjects'
import _ from 'lodash'

export default {
  name: 'Search',
  data: () => ({
    selected: null,
    subjects: []
  }),
  methods: {
    async add () {
      let subject = this.selected
      this.selected = ''

      let status = await this.$store.dispatch('addSubject', subject)
      if (status !== 200)
        console.error('Failed to add subject')
    }
  },
  created () {
    this.filterSubjects = _.debounce(term => {
      if (!term || term.length < 2)
        return

      this.subjects = subjects.filter(s => s.toLowerCase().includes(term))
    }, 500)
  }
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine";
@include md-register-theme("default", (
  theme: light
));
@import "~vue-material/dist/theme/all";

.md-highlight-text-match {
  color: md-get-palette-color(cyan, 700) !important;
}

#search {
  margin-bottom: 20px;

  .add {
    margin: 0;
    width: 100%;
    color: #FFF;
  }
}
</style>
