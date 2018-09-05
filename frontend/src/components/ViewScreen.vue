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
        :size="100"
        :width="2"
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
        v-icon mood
        .display-1 No Upcoming Events
        .title Looks like you are done for today!
  today.today(
    :class="{ 'show' : (loading === false && curated.length > 0) }"
    :curated-data="curated"
  )
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import Today from '@/components/Today'
import {
  API_ENDPOINT,
  API_KEY
} from '@/config'

export default {
  name: 'ViewScreen',
  components: { Today },
  data: () => ({
    ics: null,
    loading: true
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
  async mounted () {
    this.loading = true
    try {
      const result = await axios.get(`${API_ENDPOINT + this.$route.params.cid}`, {
        headers: {
          'X-API-KEY': API_KEY
        }
      })
      this.ics = result.data
      this.loading = false
    } catch (e) {
      console.log(e)
      this.loading = false
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
      font-size 100px
    
    .display-1
      margin 20px 0
      
  .today
    visibility hidden
    
    &.show
      visibility visible
</style>
