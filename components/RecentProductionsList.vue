<template>
  <div class="recent-prod">
    <VRow>
      <VCol v-for="n in 2" :key="n" sm="6">
        <span v-if="productions[n]">
          <NuxtLink :to="'/productions/' + productions[n].id" class="recent-prod-link">
            <VImg
              :src="productions[n].thumbnail.link"
              :title="productions[n].name"
              :aspect-ratio="16/9"
              gradient="to top, rgba(0,0,0,0.3), rgba(0,0,0,0)"
            />
          </NuxtLink>
        </span>
      </VCol>
    </VRow>
    <VRow>
      <VCol v-for="n in 3" :key="n" sm="3">
        <span v-if="productions[n+2]">
          <NuxtLink :to="'/productions/' + productions[n+2].id" class="recent-prod-link">
            <VImg
              :src="productions[n+2].thumbnail.link"
              :title="productions[n+2].name"
              :aspect-ratio="16/9"
              gradient="to top, rgba(0,0,0,0.3), rgba(0,0,0,0)"
            />
          </NuxtLink>
        </span>
      </VCol>
      <VCol sm="3">
        <NuxtLink to="/productions" class="recent-prod-link">
          <VResponsive :aspect-ratio="16/9" class="view-more">
            <h3>View More</h3>
          </VResponsive>
        </NuxtLink>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import moment from 'moment'
import 'simplebar/dist/simplebar.min.css'

export default {
  name: 'RecentProductionsList',
  components: {
  },
  data () {
    return {
      productions: []
    }
  },
  methods: {
    getFormattedDate (production) {
      return moment(production.startTime).format('MMM Do YYYY')
    }
  },
  apollo: {
    productions: {
      prefetch: false,
      variables: {
        count: 6
      },
      query: gql`query RecentProductionsListProductions($count: Int!) {
        productions(pageSize: $count) {
          id
          description
          name
          thumbnail {
              name
              link
          }
          startTime
        }
      }`
    }
  }
}
</script>

<style lang="scss" scoped>
  .view-more {
    text-align: center;
    display: flex;
    align-items: center;
    background-color: #00000030;
    font-size: 1vw;
    @media (max-width 2500px) {
      font-size: 1.5vw;
    }
    @media (max-width: 600px) {
      font-size: 3vw;
    }
  }
  .recent-prod-link {
    color: white;
    text-decoration: none;
  }
</style>
