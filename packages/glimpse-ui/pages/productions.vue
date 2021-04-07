<template>
  <div class="">
    <VRow>
      <VCol cols="12" md="4" lg="3" offset-md="1" class="filters">
        <VRow>
          <VCol cols="12" sm="10" offset-sm="1">
            <h1 class="title">
              Productions
            </h1>
            <h2>Filters</h2>
            <VTextField @change="searchInput" v-model="searchVal" class="search" label="Search..." />
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="12" md="6" lg="7" offset-md="5" offset-lg="4">
        <div class="cards">
          <div v-for="prod in productions" class="rowitem">
            <ProductionCard
              :production-id="parseInt(prod.id)"
              :name="prod.name"
              :thumbnail="prod.thumbnail.link"
              :start="prod.startTime"
            />
          </div>
        </div>
      </VCol>
    </VRow>
    <VRow>
      <VCol
        class="page-bottom"
      >
        <div
          v-intersect="onIntersect"
          class="end"
        />
        <div v-if="loadingMore">
          <VProgressCircular :size="70" :width="7" indeterminate color="primary" />
          <p class="loading-text">
            Loading...
          </p>
        </div>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import ProductionCard from '@/components/ProductionCard'

export default {
  components: { ProductionCard },
  data () {
    return {
      title: 'Our Productions - RPI TV',
      description: 'List of all of RPI TV\'s past productions',
      searchVal: '',
      productions: [],
      loadingMore: false,
      prevPage: 0,
      // Note: the numbers 300 and 168.75 are important; they are the width & height of each individual card.
      countPerPage: Math.floor((this.$vuetify.breakpoint.width / 300) * (this.$vuetify.breakpoint.height / 168.75))
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'og:title', name: 'og:title', content: this.title },
        { hid: 'og:description', name: 'og:description', content: this.description },
        { hid: 'description', name: 'description', content: this.description },
        { hid: 'twitter:description', name: 'twitter:description', content: this.description }
      ]
    }
  },
  methods: {
    async onIntersect () {
      this.loadingMore = true
      const result = await this.$apollo.query({
        query: gql`query ProductionsGetProductions($prevProductionIndex: Int!, $pageSize: Int!) {
        productions: productions(pageSize: $pageSize, prevProductionIndex: $prevProductionIndex) {
          id
          name
          startTime
          thumbnail {
            link
          }
        }
      }`,
        variables: {
          prevProductionIndex: this.prevPage * this.countPerPage,
          pageSize: this.countPerPage
        }
      })
      this.prevPage++
      this.productions = this.productions.concat(result.data.productions)
      this.loadingMore = false
    },
    searchInput (v) {
      console.log(v)
    }
  }
}
</script>

<style lang="scss" scoped>

@import '~vuetify/src/styles/styles';
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, max-content));
  justify-content: left;
  @media(max-width: map-get($grid-breakpoints, 'md')) {
    justify-content: center;
  }
}
.title {
  margin-bottom: 30px;
}
.rowitem {
  @media(max-width: map-get($grid-breakpoints, 'md')) {
    margin-left: 10px;
  }
  margin-bottom: 20px;
}
.end {
  position: absolute;
  bottom: 0;
  padding-top: 30px;
}
.filters {
  position: fixed;
  @media(max-width: map-get($grid-breakpoints, 'md')) {
    position: inherit;
  }
}
.page-bottom {
  text-align: center;
}
.loading-text {
  margin-top: 20px;
}
</style>
