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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
