<template lang="pug">
.md-layout#today

  .md-layout-item.md-size-100
    span.md-display-1 Today's Agenda

  .md-layout-item.md-size-25.md-xsmall-size-100.md-small-size-50.md-medium-size-33.md-large-size-25.md-xlarge-size-20.events-layout
    md-card(
      v-for="(item, index) in curatedData"
      :key="index"
      :class="{ 'md-accent': item.uid == upcoming.uid }"
      :md-theme="[item.uid == upcoming.uid ? 'card-light' : 'card-dark']"
    )
      md-card-area(md-inset)
        md-card-header
          h2.md-title {{ item.summary }}
          .md-subhead
            md-icon location_on
            span {{ item.location }}
        md-card-content(v-if="item.uid == upcoming.uid") {{ displayText(item.start) }}
      md-card-content
        .card-time
          md-icon access_time
          span {{ moment(item.start).format('HH:mm') }} - {{ moment(item.end).format('HH:mm') }}

  .md-layout-item.md-size-75.md-xsmall-size-100.md-small-size-50.md-medium-size-66.md-large-size-75.md-xlarge-size-80.mazemap-layout
    .mazemap.md-elevation-3(
      ref="map"
      :class="{ 'hidden' : !displayMap }"
    )
    md-empty-state(
      v-if="empty"
      md-icon="mood"
      md-label="No Upcoming Events"
      md-description="Looks like you are done for today!"
    )
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
    })
  }
}
</script>

<style lang="scss" scoped>
@import "~vue-material/dist/theme/engine";
@include md-register-theme("default", (
  theme: dark
));
@include md-register-theme("card-dark", (
  theme: dark
));
@include md-register-theme("card-light", (
  theme: light
));
@import "~vue-material/dist/theme/all";

#today {
  height: 100%;

  .md-display-1 {
    margin-bottom: 30px;
    display: block;
  }

  .md-card {
    margin-bottom: 15px;
    vertical-align: top;
    background: #26C6DA;

    &.md-accent {
      background: #FFF;
      color: #000;

      .md-card-content {
        padding-top: 0;
      }
    }

    .md-subhead {
      .md-icon {
        $size: 16px;

        width: $size;
        min-width: $size;
        height: $size;
        margin-right: 4px;
        font-size: $size !important;
      }

      span {
        vertical-align: middle;
      }
    }

    .card-time {
      margin-top: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .md-icon {
        margin: 8px;
      }
    }
  }

  .events-layout {
    padding-right: 15px;
  }

  .mazemap-layout {
    height: -webkit-calc(100% - 85px);
    height: -moz-calc(100% - 85px);
    height: calc(100% - 85px);
    position: relative;

    .mazemap {
      width: 100%;
      height: 100%;
      border-radius: 3px;

      &.hidden {
        opacity: 0;
      }
    }

    .md-empty-state {
      top: 0;
      left: 0;
      margin: 0 auto;
      position: relative;
    }
  }
}
</style>
