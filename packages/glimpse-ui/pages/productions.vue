<template>
  <div class="container">
    <h1 class="title">
      Productions
    </h1>
    <div class="rowitem">
      <ProductionCard
        :production-id="6"
      />
      <ProductionCard
        :production-id="2"
      />
      <ProductionCard
        :production-id="3"
      />
      <ProductionCard
        :production-id="4"
      />
      <ProductionCard
        :production-id="5"
      />
    </div>
  </div>
</template>

<script>

import ProductionCard from '@/components/ProductionCard'
export default {
  components: { ProductionCard },
  data () {
    return {
      title: 'Our Productions - RPI TV',
      description: 'List of all of RPI TV\'s past productions'
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
  }
}
</script>

<style lang="scss" scoped>
  .rowitem {
    display: flex;
    justify-content: space-between;
  }
</style>
