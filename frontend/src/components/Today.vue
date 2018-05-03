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

  .md-layout-item.md-size-75.md-xsmall-size-100.md-small-size-50.md-medium-size-66.md-large-size-75.md-xlarge-size-80.mazemap-layout(:class="{ 'hidden' : !displayMap }")
    .mazemap(ref="map")
</template>

<script>
import moment from 'moment'

const CAMPUS_ID    = 5
const START_POI    = { poiId: 174582 }
const CENTER       = { lng: 18.977056, lat: 69.681613 }
const DEFAULT_ZOOM = 18

export default {
  name: 'Today',
  props: ['curatedData'],
  data: () => ({
    map: null,
    search: null,
    routeController: null,
    displayMap: false
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
    upcoming: function (item) {
      try {
        const searchTerm = item.location.replace('.', '')

        this.search.search(searchTerm)
          .then(res => {
            const dest = { poiId: res.results[0].poiId }

            Mazemap.Data.getRouteJSON(START_POI, dest)
              .then(geojson => {
                this.displayMap = true
                this.routeController.setPath(geojson)

                // Fit the map bounds to the path bounding box
                let bounds = Mazemap.Util.Turf.bbox(geojson)
                this.map.fitBounds(bounds, { padding: 10 })
              })
          })
      } catch (err) {

      }
    }
  },
  methods: {
    moment (p) {
      return moment(p)
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
      campuses:      CAMPUS_ID,
      center:        CENTER,
      zoom:          DEFAULT_ZOOM,
      zLevelControl: false
    })
    this.search = new Mazemap.Search.SearchController({
      campusid: CAMPUS_ID,
      rows: 1
    })
    this.map.on('load', () => {
      this.routeController = new Mazemap.RouteController(this.map, {
        routeLineColorPrimary: '#27c6da',
        routeLineColorSecondary: '#0197a7'
      })
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

    &.hidden {
      opacity: 0;
    }

    .mazemap {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
