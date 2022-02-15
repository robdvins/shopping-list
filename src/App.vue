<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div :class="['relative flex h-screen', route.name === 'Home' ? 'bg-white' : 'bg-gray-200']">
    <div
      class="absolute right-[28%] h-64 w-3/5 -translate-y-[175%] rotate-[15deg] rounded-full opacity-[0.15] shadow-[20px_250px_300px] shadow-blue-500 transition-opacity ease-[cubic-bezier(0.17,0.17,0,1)]"
    ></div>
    <router-view />
  </div>
</template>
