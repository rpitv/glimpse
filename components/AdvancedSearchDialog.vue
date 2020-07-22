<template>
  <VDialog
    v-model="show"
    max-width="700px"
  >
    <VCard>
      <VCardTitle class="headline">
        Advanced Search Help
      </VCardTitle>

      <VCardText>
        <p>Advanced searching is supported in all search menus on the RPI TV website by using a special syntax.</p>
        <p>Hover above the rules below for examples of how to use them.</p>
        <ul class="syntax-list">
          <li>Searches are split into words at each space (<kbd>&nbsp;</kbd>). Searches match if any field contains ONE OF the words.</li>
          <li>
            Words are "optional", unless followed by a <kbd>!</kbd>.
          </li>
          <li>
            You can search for specific fields by prepending the field name, followed by a <kbd>:</kbd>.
          </li>
          <li>
            You can search for a number range by putting a <kbd>-</kbd> between two numbers.
          </li>
          <li>
            You can include spaces in your search by wrapping your search in two <kbd>"</kbd> characters.
          </li>
          <li>
            You can escape any of the above special characters by prepending them with a <kbd>/</kbd>.
          </li>
        </ul>
        <div v-if="fields" class="this-fields">
          <p>The supported fields in this search menu are:</p>
          <ul>
            <li v-for="field in fields" :key="field">
              <kbd>{{ field }}</kbd>
            </li>
          </ul>
        </div>
      </VCardText>

      <VCardActions>
        <VSpacer />

        <VBtn
          @click="show = false"
          text
          color="error"
        >
          Close
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script>
export default {
  name: 'AdvancedSearchDialog',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    fields: {
      type: Array,
      default: undefined
    }
  },
  data () {
    return {
      show: this.value
    }
  },
  watch: {
    value () {
      this.show = this.value
    },
    show () {
      this.$emit('input', this.show)
    }
  }
}
</script>

<style scoped>
  .this-fields {
    margin-top: 20px;
  }
  .syntax-list {
    line-height: 2em;
  }
</style>
