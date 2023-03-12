<template>
  <component :is="renderMarkdown" />
</template>

<script setup lang="ts">
import DOMPurify from "dompurify";
import { marked } from "marked";
import { createTextVNode, h, ref, useSlots, VNode, VNodeArrayChildren, VNodeChild } from "vue";

const slots = useSlots();
const content = ref<HTMLElement | null>(null);

function formatNode(node: VNodeArrayChildren | VNodeChild): VNode {
  if(!node) {
    return createTextVNode("");
  }

  if(typeof node === "boolean" || typeof node === "number" || typeof node === "symbol") {
    return createTextVNode(node.toString());
  }

  if(typeof node === "string") {
    return h("div", { innerHTML: DOMPurify.sanitize(marked(node)) });
  }

  if(Array.isArray(node)) {
    for(let i = 0; i < node.length; i++) {
      node[i] = formatNode(node[i]);
    }
    return h("div", {}, node);
  }

  if(Array.isArray(node.children) || typeof node.children === "string") {
    return formatNode(node.children);
  }

  return node;
}

function renderMarkdown() {
  const defaultSlot = slots?.default?.();
  if(!defaultSlot) {
    return h("div", { innerHTML: "" });
  }

  for(let i = 0; i < defaultSlot.length; i++) {
    defaultSlot[i] = formatNode(defaultSlot[i]);
  }

  return h("div", {}, defaultSlot);
}
</script>

<style scoped lang="scss">

</style>
