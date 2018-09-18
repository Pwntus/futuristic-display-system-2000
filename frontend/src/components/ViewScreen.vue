<template lang="pug">
#view-screen
  v-container(
    v-if="loading === true"
    fluid
    fill-height
  )
    v-layout(
      align-center
      justify-center
    )
      v-progress-circular(
        :size="200"
        :width="4"
        indeterminate
        color="white"
      )
  v-container(
    v-if="loading === false && curated.length <= 0"
    fluid
    fill-height
  )
    v-layout.done(
      align-center
      justify-center
    )
      div
        v-icon {{ getDoneIcon() }}
        .display-2 No Upcoming Events
        .display-1 Looks like you are done for today!
  today.today(
    :class="{ 'show' : (loading === false && curated.length > 0) }"
    :curated-data="curated"
  )
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import ical from 'node-ical'
import Today from '@/components/Today'
import { API_ENDPOINT, API_KEY } from '@/config'

export default {
  name: 'ViewScreen',
  components: { Today },
  data: () => ({
    ics: null,
    loading: true
  }),
  computed: {
    // Curated ICS list of events for today
    curated () {
      if (this.ics == null)
        return []

      let res = []
      let now = moment()
      for (let i in this.ics) {
        let item = this.ics[i]

        // Filter out non-events
        if (item.type !== 'VEVENT')
          continue

        // Filter out not-today events
        if (moment(item.start).day() !== now.day() || moment(item.end).day() !== now.day())
          continue

        res.push(item)
      }

      return res
    }
  },
  watch: {
    // Watch mapbox 'ready' state (set by Today.vue)
    '$store.state.mapbox' (value) {
      // MapBox has signaled ready and we've queued a job
      if (value === true)
        this.doJob()
    }
  },
  methods: {
    async doJob () {
      this.loading = true
      try {
        const { data } = await axios.get(`${API_ENDPOINT + this.$route.params.cid}`, {
          headers: { 'X-API-KEY': API_KEY }
        })
        this.ics = data
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },
    getDoneIcon () {
      const icons = [
        'mdi-human-handsup',
        'mdi-linux',
        'mdi-apple-finder',
        'mdi-android',
        'mdi-cake-variant',
        'mdi-cat',
        'mdi-emoticon-poop',
        'mdi-emoticon-tongue',
        'mdi-github-face',
        'mdi-guy-fawkes-mask',
        'mdi-hand-okay',
        'mdi-hand-peace',
        'mdi-pirate',
        'mdi-run',
        'mdi-star-face',
        'mdi-sticker-emoji'
      ]
      return icons[Math.floor(Math.random() * icons.length)]
    }
  }
}
</script>

<style lang="stylus">
#view-screen
  height 100%
  
  .done
    top 0
    left 0
    margin 0 auto
    position relative
    color #01454c
    text-align center
    
    .icon
      font-size 200px
    
    .display-2
      margin 20px 0
      
  .today
    visibility hidden
    
    &.show
      visibility visible
</style>
