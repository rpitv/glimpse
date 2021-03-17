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
        <p>
          An easy-to-use UI will be introduced in the future, replacing the need to manually type in advanced searches.
          In the mean time, hover above the rules below for examples of how to use them.
        </p>
        <ul class="syntax-list">
          <li>
            <VTooltip top>
              <template v-slot:activator="{ on }">
                <p v-on="on">
                  Searches are split into words at each space (<kbd>&nbsp;</kbd>).
                  Searches match if any field contains ONE OF the words.
                </p>
              </template>
              <span><code>One Two</code> will require results to either contain "One" OR "Two".</span>
            </VTooltip>
          </li>
          <li>
            <VTooltip top>
              <template v-slot:activator="{ on }">
                <p v-on="on">
                  Words are "optional", unless followed by a <kbd>!</kbd>.
                </p>
              </template>
              <span><code>One! Two!</code> will require results to contain both "One" AND "Two".</span>
            </VTooltip>
          </li>
          <li>
            <VTooltip top>
              <template v-slot:activator="{ on }">
                <p v-on="on">
                  You can search for specific fields by prepending the field name, followed by a <kbd>:</kbd>.
                </p>
              </template>
              <span><code>One name:Two</code> will return results which have a name which matches "Two",
                OR which match "One" in any field.</span>
            </VTooltip>
          </li>
          <li>
            <VTooltip top>
              <template v-slot:activator="{ on }">
                <p v-on="on">
                  You can search for a number range by putting a <kbd>-</kbd> between two numbers.
                </p>
              </template>
              <span><code>20-22</code> will return results which match 20, 21, OR 22.</span>
            </VTooltip>
          </li>
          <li>
            <VTooltip top>
              <template v-slot:activator="{ on }">
                <p v-on="on">
                  You can include spaces in your search words by wrapping your search in two <kbd>"</kbd> characters.
                </p>
              </template>
              <span><code>"One Two" Three</code> will return results which match "One Two" OR "Three"</span>
            </VTooltip>
          </li>
          <li>
            <VTooltip top>
              <template v-slot:activator="{ on }">
                <p v-on="on">
                  You can escape any of the above special characters by prepending them with a <kbd>/</kbd>.
                </p>
              </template>
              <span><code>One\!</code> will return results which match "One!"</span>
            </VTooltip>
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

  .syntax-list p {
    margin: 5px;
    font-weight: bold;
  }
</style>
