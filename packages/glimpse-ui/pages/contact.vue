<template>
  <div class="container">
    <VRow justify="center">
      <VCol md="8" sm="10">
        <ContactCard />
      </VCol>
    </VRow>
  </div>
</template>

<script lang="ts">
import ContactCard from '~/components/ContactCard.vue'
export default {
  components: { ContactCard },
  data (): any {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
