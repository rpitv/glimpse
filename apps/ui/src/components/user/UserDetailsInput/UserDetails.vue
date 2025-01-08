<template>
  <v-row class="mt-2">
    <v-col cols="4">
      <v-text-field :rules="[usernameRule]" density="compact" variant="outlined" label="Username *" v-model="userData.username" />
    </v-col>
    <v-col cols="4">
      <v-text-field :rules="[emailRule]" density="compact" type="email" variant="outlined" label="Email *" v-model="userData.mail" />
    </v-col>
    <v-col cols="3">
      <v-text-field :rules="[discordRule]" density="compact" type="number" variant="outlined" label="Discord ID" v-model="userData.discord" />
    </v-col>
  </v-row>
  * = required
</template>

<script setup lang="ts">
import type { User } from "@/graphql/types";
import type { PropType } from "vue";
import validator from "validator";

const usernameRule = () => {
  if (!props.userData?.username)
    return "Username is required";
  else if (props.userData.username?.length as number > 8)
    return "Username must be 8 characters or less";
  return true;
}

const emailRule = () => {
  if (!props.userData?.mail)
    return "Email is required";
  else if (!validator.isEmail(props.userData?.mail as string))
    return "Email is not valid";
  else if (props.userData.mail?.length as number > 300)
    return "Email must be 300 characters or less";
  return true;
}

const discordRule = () => {
  if (!props.userData.discord)
    return true;
  if (!validator.isNumeric(props.userData.discord as string) || props.userData.discord?.length < 18 || props.userData.discord?.length > 32)
    return "Discord IDs must be 18-32 digits long";
  return true;
}

const props = defineProps({
  userData: {
    type: Object as PropType<Partial<User>>,
    required: true
  }
})
</script>

<style scoped lang="scss">

</style>
