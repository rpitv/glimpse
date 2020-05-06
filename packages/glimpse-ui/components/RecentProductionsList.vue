<template>
  <simplebar ref="pastProdList" class="past-prod-list">
    <VCard
      :href="'/productions/' + prod.id"
      v-for="prod in productions"
      :index="prod.id"
      :key="prod.id"
      :nuxt="true"
      class="past-prod-card"
    >
      <VImg :src="prod.thumbnail.link" :title="prod.thumbnail.name" height="200px" />
      <div class="prod-card-text-wrapper">
        <VCardTitle>
          {{ prod.name }}
        </VCardTitle>
        <VCardSubtitle>
          {{ prod.description }}
        </VCardSubtitle>
      </div>
      <VRow>
        <VCol>
          <VCardText class="v-card__subtitle">
            {{ getFormattedDate(prod) }}
          </VCardText>
        </VCol>
        <VCol>
          <VCardActions class="prod-actions">
            <VBtn :href="'/productions/' + prod.id" text color="primary">
              Watch
            </VBtn>
          </VCardActions>
        </VCol>
      </VRow>
    </VCard>

    <VBtn
      v-if="showScrollButton"
      @click="pushLeft"
      fab
      dark
      x-large
      color="primary"
      class="scroll-btn"
      title="Click to scroll left"
      aria-label="Click to scroll left"
    >
      <font-awesome-icon :icon="['fal','chevron-right']" size="lg" />
    </VBtn>
  </simplebar>
</template>

<script>
import gql from 'graphql-tag'
import moment from 'moment'
import simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'

export default {
  name: 'RecentProductionsList',
  components: {
    simplebar
  },
  data () {
    return {
      productions: [],
      showScrollButton: true
    }
  },
  mounted () {
    this.$refs.pastProdList.SimpleBar.getScrollElement().addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    this.$refs.pastProdList.SimpleBar.getScrollElement().removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    getFormattedDate (production) {
      return moment(production.startTime).format('MMM Do YYYY')
    },
    handleScroll (evt) {
      this.showScrollButton = (evt.target.scrollLeft === 0)
    },
    /**
     * Push this list left (or right, depending on how you think about it) one full width.
     * This exists for the right-chevron button, to demonstrate that this list is scrollable.
     * It scrolls in an ease-out manner one full width, or until the end of the list is hit.
     */
    pushLeft () {
      let pxToPush = this.$refs.pastProdList.SimpleBar.getScrollElement().offsetWidth // Scroll the width of the element
      // Runs every 5ms
      const interval = setInterval(() => {
        const pushAmount = pxToPush / 35 // Scroll by 1/35th of the remaining amount - Creates ease-out effect
        this.$refs.pastProdList.SimpleBar.getScrollElement().scrollLeft += pushAmount

        pxToPush -= pushAmount

        if (pxToPush <= 1) { // Stop when 1 px left, with 0 it breaks as you infinitely approach 0
          clearInterval(interval)
        }
      }, 5)
    }
  },
  apollo: {
    productions: gql`query RecentProductionsListProductions { productions {
        id
        description
        name
        thumbnail {
            name
            link
        }
        startTime
}}`
  }
}
</script>

<style lang="scss" scoped>
  @use "sass:map";
  @import "~vuetify/src/styles/styles.sass";

  .past-prod-list {
    position: relative;
    @media(min-device-width: 500px) {
      white-space: nowrap;
      overflow-x: scroll;

      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
      }

      .past-prod-card {
        margin-right: 20px;
      }
    }

    @media (max-device-width: 500px) {
      text-align: center;
      .past-prod-card {
        text-align: initial;
        margin-bottom: 20px;
      }
      .scroll-btn {
        display: none;
      }
    }
    .past-prod-card {
      display: inline-block;
      width: 300px;
      margin-bottom: 20px;
    }

    .prod-actions {
      float: right;
    }
  }
  .prod-card-text-wrapper {
    height: 150px;
    overflow: hidden;
    text-overflow: ellipsis;

    &:before {
      content:'';
      width:100%;
      height: 12%;
      position:absolute;
      left:0;
      bottom: 78px;
      background:linear-gradient(transparent, map.get($grey, "darken-3"));
    }
  }
  .scroll-btn {
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
    position: absolute;
    z-index: 100;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }
</style>
