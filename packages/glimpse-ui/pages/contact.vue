<template>
  <div class="container">
    <VRow justify="center">
      <VCol md="8" sm="10">
        <ContactCard />
      </VCol>
    </VRow>
  </div>
</template>

<script>
import ContactCard from '~/components/ContactCard.vue'
export default {
  layout: 'with-shape',
  components: { ContactCard },
  data () {
    return {
      title: 'Contact us / Request our services - RPI TV',
      description: 'Fill out this form if you have any questions, feedback, or would like to request our services for a campus event.'
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
