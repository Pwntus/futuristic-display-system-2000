<template lang="pug">
.md-layout.md-alignment-center-center#dashboard(v-if="$store.getters.cid")
  .md-layout-item.md-size-25.md-xsmall-size-100.md-small-size-50.md-medium-size-50.md-large-size-33.md-xlarge-size-25
    search
    list
</template>

<script>
import Search from '@/components/Search'
import List from '@/components/List'

export default {
  name: 'Dashboard',
  components: {
    Search,
    List
  }
}
</script>

<style lang="scss" scoped>
#dashboard {
}
</style>
