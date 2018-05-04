<template lang="pug">
#view-screen
  md-progress-spinner.md-accent(
    v-if="!done"
    md-mode="indeterminate"
    :md-diameter="80"
    :md-stroke="5"
  )
  md-empty-state(
    v-if="done && curated.length <= 0"
    md-icon="sentiment_dissatisfied"
    md-label="No Data"
    md-description="Please visit http://localhost:8080 and add courses to your card."
  )
  today.today(
    :class="{ 'show' : done && curated.length > 0 }"
    :curated-data="curated"
  )
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Today from '@/components/Today'
import { API_BASE } from '@/config'

export default {
  name: 'ViewScreen',
  components: { Today },
  data: () => ({
    ics: null,
    done: false
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
    axios.get(`${API_BASE + this.$route.params.cid}/screen`)
      .then(res => {
        this.ics = res.data
        this.done = true
      })
      .catch(err => {
        this.done = true
      })
  }
}
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine";
@include md-register-theme("default", (
  primary: md-get-palette-color(white, 500),
  accent: md-get-palette-color(white, 500),
  theme: light
));
@import "~vue-material/dist/theme/all";

#view-screen {
  height: 100%;
  padding: 15px;

  .md-progress-spinner {
    top: 50%;
    left: 50%;
    margin: -40px 0 0 -40px;
    position: absolute;

    .md-progress-spinner-circle {
      stroke: #FFF;
    }
  }

  .md-empty-state {
    top: 50%;
    left: 50%;
    margin: -140px 0 0 -210px;
    position: absolute;
    color: #FFF;
  }

  .today {
    visibility: hidden;

    &.show {
      visibility: visible;
    }
  }
}
</style>
