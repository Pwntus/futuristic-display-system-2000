<template lang="pug">
#list
  md-list
    md-list-item(
      v-for="(item, index) in $store.getters.subjects"
      :key="index"
    )
      span.md-list-item-text {{ item.label }}
      md-button.md-icon-button.md-list-action(@click="remove(item.id)")
        md-icon clear

  md-empty-state(
    v-if="$store.getters.subjects.length <= 0"
    md-icon="playlist_add"
    md-label="Add Courses"
    md-description="These courses will be used to display a personalized page when the Student Card is scanned."
  )
</template>

<script>
export default {
  name: 'List',
  methods: {
    async remove (id) {
      let status = await this.$store.dispatch('removeSubject', id)
      if (status !== 200)
        console.error('Failed to remove subject')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~vue-material/dist/theme/engine";
@include md-register-theme("default", (
  theme: dark
));
@import "~vue-material/dist/theme/all";

#list {
  .md-list {
    background: transparent;
  }

  .md-empty-state {
    color: #FFF;
  }
}
</style>
