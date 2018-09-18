<template lang="pug">
v-container#today(
  fluid grid-list-md
  fill-height
)
  v-layout(row wrap)

    v-flex(xs12)
      .display-2.white--text Today's Agenda

    v-flex.events-layout(xs12 sm12 md4 lg3 xl2)
      v-card(
        v-for="(item, index) in curatedData"
        :key="index"
        :class="{ 'upcoming': item.uid == upcoming.uid }"
      )
        v-card-title(primary-title)
          div
            .headline {{ item.summary }}
            .subheading
              v-icon location_on
              span {{ item.location }}
            .display-text(v-if="item.uid == upcoming.uid") {{ displayText(item.start) }}
        v-card-actions
          v-spacer
          .card-time
            span {{ moment(item.start).format('HH:mm') }} - {{ moment(item.end).format('HH:mm') }}
            v-icon access_time


    v-flex.mazemap-layout(xs12 sm12 md8 lg9 xl10)
      .mazemap.elevation-3(
        ref="map"
        :class="{ 'hidden' : !displayMap }"
      )
      v-layout.done(
        v-if="empty"
        justify-center
      )
        div
          v-icon {{ getDoneIcon() }}
          .display-2 No Upcoming Events
          .display-1 Looks like you are done for today!
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import {
  NAME2POI_BASE,
  MM_CAMPUS_ID,
  MM_START_POI,
  MM_CENTER_LNGLAT,
  MM_ZOOM,
  MM_ZLVL
} from '@/config'

export default {
  name: 'Today',
  props: ['curatedData'],
  data: () => ({
    map: null,
    routeController: null,
    displayMap: false,
    animateMap: null,
    empty: false
  }),
  computed: {
    upcoming () {
      if (!this.curatedData || this.curatedData.length <= 0)
        return null

      let now = moment()
      let closest = null
      let closestItem = { uid: null }

      for (let i in this.curatedData) {
        let item = this.curatedData[i]

        if (moment(item.end).isAfter(now)) {
          if (closest == null || moment(item.end).isSameOrBefore(closest)) {
            closest = moment(item.end)
            closestItem = item
          }
        }
      }

      return closestItem
    },
    cardColor (item) {
      return item.uid == upcoming.uid ? 'red' : 'blue'
    }
  },
  watch: {
    upcoming: function (val) {
      if (val.hasOwnProperty('location')) {
        this.findRoute(val.location)
      } else {
        this.empty = true
      }
    }
  },
  methods: {
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
    },
    // Used in template
    moment (p) {
      return moment(p)
    },
    findRoute (location) {
      try {
        const searchTerm = encodeURIComponent(location)

        axios.get(NAME2POI_BASE + searchTerm)
          .then(res => res.data)
          .then(res => {
            if (res.success !== 'true')
              return

            const start = { poiId: MM_START_POI }
            const dest = {
              lngLat: {
                lng: res.mazemap_lon,
                lat: res.mazemap_lat
              },
              zLevel: res.mazemap_z_index
            }

            // Highlight POI
            Mazemap.Data.getPoiAt(dest.lngLat, dest.zLevel)
              .then(poi => {
                if (poi !== false) {
                  poi.properties.zLevel = MM_ZLVL // Ensure that the highlight is painted regardless of map zLevel
                  this.map.highlighter.highlight(poi)
                }
              })

            Mazemap.Data.getRouteJSON(start, dest)
              .then(geojson => {
                this.routeController.setPath(geojson)

                // Fit the map bounds to the path bounding box
                let bounds = Mazemap.Util.Turf.bbox(geojson)
                this.map.fitBounds(bounds, {
                  padding: 100,
                  duration: 0 // Required for animation to work!
                })

                // Animate
                this.animateMap = () => {
                  this.map.easeTo({
                    bearing: this.map.getBearing() + 40,
                    easing: function (t) { return t },
                    duration: 30000
                  })
                }
                this.animateMap()
                setInterval(this.animateMap, 30000)

                this.displayMap = true
              })
          })
      } catch (err) {
        console.error(err)
      }
    },
    displayText (start) {
      if (moment().isAfter(start)) {
        return `Currently ongoing. Started ${moment(start).fromNow()}.`
      } else {
        return `Upcoming. Starts ${moment(start).fromNow()}.`
      }
    }
  },
  mounted () {
    this.map = new Mazemap.Map({
      container:     this.$refs.map,
      campuses:      MM_CAMPUS_ID,
      center:        MM_CENTER_LNGLAT,
      zoom:          MM_ZOOM,
      zLevel:        MM_ZLVL,
      pitch:         48.49,
      bearing:       0,
      zLevelControl: false
    })
    this.map.on('load', () => {
      this.routeController = new Mazemap.RouteController(this.map, {
        routeLineColorPrimary: '#27c6da',
        routeLineColorSecondary: '#0197a7'
      })
      this.map.highlighter = new Mazemap.Highlighter(this.map, {
        showOutline: true,
        showFill: true,
        outlineColor: Mazemap.Util.Colors.MazeColors.MazeGreen,
        fillColor: Mazemap.Util.Colors.MazeColors.MazeGreen
      })
      new Mazemap.BlueDot( {
        zLevel: MM_ZLVL,
        accuracyCircle: true,
        radius: 3,
        lngLat: MM_CENTER_LNGLAT,
        fillColor: '#27c6da'
      }).addTo(this.map)

      // Signal MapBox done loading
      this.$store.commit('setMapbox', true)
    })
  }
}
</script>

<style lang="stylus" scoped>
#today
  height 100%
  padding 8px 0 8px 20px

  .display-2
    margin-bottom 30px
    font-size 60px
    display block

  .events-layout
    padding 0 18px 0 0
    
    .card
      margin-bottom 15px
      vertical-align top
      background #26C6DA
      color #01454c

      &.upcoming
        border 4px solid #FFF

      .card__title
        padding-top 16px
        padding-bottom 0
        
      .subheading
        padding 10px 0
        
        .icon
          $size 16px

          width $size
          min-width $size
          height $size
          margin-right 4px
          font-size $size !important

        span
          vertical-align middle

      .card-time
        margin-top 8px
        display flex
        align-items center
        justify-content space-between

        .icon
          margin 8px

  .mazemap-layout
    height -webkit-calc(100% - 94px)
    height -moz-calc(100% - 94px)
    height calc(100% - 94px)
    position relative

    .mazemap
      width -webkit-calc(100% - 18px)
      width -moz-calc(100% - 18px)
      width calc(100% - 18px)
      height 100%
      border-radius 3px

      &.hidden
        opacity 0

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
</style>
