<script setup lang="ts">
defineProps<{ priority: string }>()
</script>

<template>
  <span
    :class="[
      'h-2.5 w-2.5 rounded border-2',
      {
        'border-green-500': priority.toLocaleLowerCase() === 'low',
        'border-yellow-500': priority.toLocaleLowerCase() === 'medium',
        'border-red-500': priority.toLocaleLowerCase() === 'high'
      }
    ]"
  ></span>
</template>
