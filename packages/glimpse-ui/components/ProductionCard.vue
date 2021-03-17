<template>
  <NuxtLink :to="'/productions/' + productionId" class="card">
    <VCard :width="width">
      <VImg
        :src="thumbnail"
        :title="name"
        :aspect-ratio="16/9"
        gradient="to top, rgba(0,0,0,0.3), rgba(0,0,0,0)"
      >
        <VCardTitle class="title">
          {{ name }}
        </VCardTitle>
      </VImg>
    </VCard>
  </NuxtLink>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'ProductionCard',
  props: {
    productionId: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      production: {}
    }
  },
  computed: {
    thumbnail () {
      if (!this.production || !this.production.thumbnail || !this.production.thumbnail.link) {
        return 'https://www.grahambrown.com/dw/image/v2/BBBG_PRD/on/demandware.static/-/Sites-product-master/default/dw496dc722/images/large/CT-060-096_1.jpg?sw=1024&sh=1024&sm=fit'
      }
      return this.production.thumbnail.link
    },
    name () {
      if (!this.production || !this.production.name) {
        return ''
      }
      return this.production.name
    }
  },
  apollo: {
    production: {
      variables () {
        return {
          id: this.productionId
        }
      },
      query: gql`query ProductionCardGetProduction($id: Int!) {
        production: getProduction(id: $id) {
          name
          thumbnail {
              link
          }
        }
      }`
    }
  }
}
</script>

<style scoped lang="scss">
  .card {
    color: white;
    text-decoration: none;
    display: inline-block;
  }
  .title {
    position: absolute;
    bottom: 0;
  }
</style>
