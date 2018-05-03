<template lang="pug">
#view-screen
  today(:curated-data="curated")
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Today from '@/components/Today'

export default {
  name: 'ViewScreen',
  components: { Today },
  data: () => ({
    ics: null,
    err: false
  }),
  computed: {
    curated () {
      if (this.ics == null)
        return []

      let res = []
      let now = moment()
      for (let i in this.ics) {
        let item = this.ics[i]

        // Filter out only todays events
        if (item.type !== 'VEVENT')
          continue
        if (moment(item.start).day() !== now.day() || moment(item.end).day() !== now.day())
          continue

        res.push(item)
      }

      return res
    }
  },
  mounted () {
    axios.get(`http://localhost:3002/${this.$route.params.cid}/screen`)
      .then(res => {
        this.ics = res.data
      })
      .catch(err => {
        this.err = true
      })
  }
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine";
@include md-register-theme("default", (
  primary: md-get-palette-color(white, 700),
  theme: light
));
@import "~vue-material/dist/theme/all";

#view-screen {
  height: 100%;
  padding: 15px;
}
</style>
