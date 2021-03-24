<template>
  <div class="container">
    <h1 class="title">
      Productions
    </h1>
    <div class="cards">
      <div v-for="prod in productions" class="rowitem">
        <ProductionCard
          :production-id="parseInt(prod.id)"
          :name="prod.name"
          :thumbnail="prod.thumbnail.link"
          :start="prod.startTime"
        />
      </div>
      <div
        v-intersect="onIntersect"
        class="end"
      />
    </div>
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
      productions: []
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
    onIntersect () {
      console.log('Intersect!')
    }
  },
  apollo: {
    productions: {
      query: gql`query ProductionsGetProductions {
        productions: productions(pageSize: 500) {
          id
          name
          startTime
          thumbnail {
            link
          }
        }
      }`
    }
  }
}
</script>

<style lang="scss" scoped>
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, max-content));
    justify-content: center;
  }
  .rowitem {
    margin-bottom: 20px;
  }
</style>
