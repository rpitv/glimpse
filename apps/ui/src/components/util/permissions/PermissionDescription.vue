<template>
  <Markdown>{{ permissionDescriptionMarkdown }}</Markdown>
</template>

<script setup lang="ts">
import type { Permission } from "@/graphql/types";
import type { PropType } from "vue";
import { computed } from "vue";
import Markdown from "@/components/util/Markdown.vue";

const props = defineProps({
  permission: {
    type: Object as PropType<Permission>,
    required: true
  },
})

const permissionDescriptionMarkdown = computed<string>(() => {
  let str = props.permission?.inverted ? "Revokes " : "Grants ";

  str += `permission to `

  str += props.permission?.action ? props.permission.action : "perform an unknown action on";
  str += props.permission?.action === "sort" ? " by " : " ";

  if(props.permission?.fields?.length) {
    str += 'the field';
    str += props.permission.fields.length > 1 ? 's ' : ' ';
    str += props.permission.fields.map(field => `\`${field}\``).join(", ");
    str += ' on ';
  }

  if(props.permission?.subject?.length) {
    str += props.permission.subject
      .slice(0, -1)
      .map(subject => `${formatSubject(subject)}s`)
      .join(", ");
    if(props.permission.subject.length > 2) {
      str += ", and ";
    } else if(props.permission.subject.length === 2) {
      str += " and ";
    }
    str += formatSubject(props.permission.subject[props.permission.subject.length - 1]) + "s";
  } else {
    str += "an unknown subject(s)";
  }

  if(Object.keys(props.permission?.conditions ?? {}).length) {
    str += `, so long as: \n${formatConditions(props.permission.conditions)}`
  } else {
    str += "."
  }

  if(props.permission?.inverted && props.permission?.reason) {
    str += ` The reason is set as \`${props.permission.reason}\`.`;
  }

  return str;
})

function formatSubject(subject: string) {
  // Split on capital letters, except for consecutive capital letters
  return subject.replace(/([A-Z][a-z]+)|([A-Z]{2,})/g, " $1$2").trim();
}

function formatConditions(condition: Record<string, unknown>): string {
  let str = "";
  for(const [key, value] of Object.entries(condition)) {
    if(key === "AND") {
      str += "- All of the following conditions are met: \n";
      str += (value as Record<string, unknown>[]).map((condition) => `  ${formatConditions(condition)}`).join("\n  ");
    } else if(key === "OR") {
      str += "- At least one of the following conditions are met: \n";
      str += (value as Record<string, unknown>[]).map((condition) => `  ${formatConditions(condition)}`).join("\n  ");
    } else if(key === "NOT") {
      str += "- None one of the following conditions are met: \n";
      str += (value as Record<string, unknown>[]).map((condition) => `  ${formatConditions(condition)}`).join("\n  ");
    } else {
      str += `- The field \`${key}\` is:\n`;
      str += `  ${parseConditionOperators(value as Record<string, unknown>).replaceAll("\n", "\n  ")}`;
    }
  }
  return str;
}

function parseConditionOperators(condition: Record<string, unknown>): string {
  let str = "";
  for(const [key, value] of Object.entries(condition)) {
    const parsedValue = valueParser(value);
    if(key === "equals") {
      str += `- equal to ${parsedValue}`;
      str += condition.mode === "Insensitive" ? " (case insensitive)\n" : "\n";
    } else if(key === "not") {
      str += `- not equal to ${parsedValue}`;
      str += condition.mode === "Insensitive" ? " (case insensitive)\n" : "\n";
    } else if(key === "gt") {
      str += `- greater than ${parsedValue}\n`;
    } else if(key === "lt") {
      str += `- less than ${parsedValue}\n`;
    } else if(key === "gte") {
      str += `- greater than or equal to ${parsedValue}\n`;
    } else if(key === "lte") {
      str += `- less than or equal to ${parsedValue}\n`;
    } else if(key === "in") {
      // If the value was not a variable, it will be equal to the parsed value (i.e., the variable parser just returns
      //   the value)
      if(value !== parsedValue) {
        str += `- contained within ${parsedValue}`;
      } else {
        str += `- one of the following values: ${parsedValue}`;
      }
      str += condition.mode === "Insensitive" ? " (case insensitive)\n" : "\n";
    } else if(key === "contains") {
      str += `- contains ${parsedValue}`;
      str += condition.mode === "Insensitive" ? " (case insensitive)\n" : "\n";
    } else if(key === "startsWith") {
      str += `- starts with ${parsedValue}`;
      str += condition.mode === "Insensitive" ? " (case insensitive)\n" : "\n";
    } else if(key === "endsWith") {
      str += `- ends with ${parsedValue}`;
      str += condition.mode === "Insensitive" ? " (case insensitive)\n" : "\n";
    }
  }
  return str;
}

function valueParser<T>(value: T): string {

  // Handle variables
  if(typeof value === "string" && value.startsWith("$")) {
    if(value === "$groups") {
      return "a list of the user's group IDs";
    } else if(value === "$id") {
      return "the user's ID";
    } else if(value === "$now") {
      return "the current date and time";
    } else if(value === "$person") {
      return "the user's own Person ID"
    }
    return "an unknown variable";
  }

  // Handle arrays by combining them into a comma-separated list of values ran through this function recursively
  if(Array.isArray(value)) {
    return (value as unknown[]).map(v => valueParser(v)).join(', ');
  }

  // Wrap strings in quotes
  if(typeof value === "string") {
    return `\`"${value}"\``;
  }


  return `\`${value}\``;
}
</script>

<style scoped lang="scss">
</style>
