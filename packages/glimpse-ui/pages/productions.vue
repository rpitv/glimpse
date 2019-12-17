<template>
  <div class="container">
    <h1 class="title">
      Productions
    </h1>
  </div>
</template>

<script>

export default {
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

</style>
