<script setup lang="ts">
defineProps<{ tag?: string; moveDelay: string }>()
</script>

<template>
  <TransitionGroup
    :tag="tag"
    mode="out-in"
    enter-active-class="z-40 transition duration-[600ms] ease-[cubic-bezier(.18,.89,.32,1.28)] transform-gpu"
    enter-from-class="-translate-y-16 opacity-0"
    enter-to-class="transforom-none opacity-100"
    leave-active-class="absolute transition duration-[1500ms] ease-ease-[cubic-bezier(.6,-0.28,.74,.05)] transform-gpu"
    leave-from-class="transform-none opacity-100"
    leave-to-class="translate-y-4 rotate[4deg] blur-md opacity-0"
    :move-class="`transition-all duration-500 ${moveDelay} ease-[cubic-bezier(.18,.89,.32,1.28)] transform-gpu`"
  >
    <slot></slot>
  </TransitionGroup>
</template>
