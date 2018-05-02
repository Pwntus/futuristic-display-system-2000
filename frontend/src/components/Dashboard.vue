<template lang="pug">
#dashboard(v-if="$store.getters.cid")
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
