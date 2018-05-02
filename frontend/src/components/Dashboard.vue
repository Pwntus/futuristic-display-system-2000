<template lang="pug">
#dashboard(v-if="$store.getters.cid")
  search
</template>

<script>
import Search from '@/components/Search'

export default {
  name: 'Dashboard',
  components: {
    Search
  },
  data: () => ({
  })
}
</script>

<style lang="scss" scoped>
#dashboard {
}
</style>
