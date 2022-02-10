<script setup lang="ts">
import { ref } from 'vue'
import { Presence, Motion } from 'motion/vue'

interface Product {
  product: {
    name: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    purchased: boolean
    quantity: number
  }
}
const props = defineProps<Product>()

const checked = ref(props.product.purchased)
</script>

<template>
  <li class="flex items-center rounded-xl bg-white p-3">
    <input
      :id="product.name"
      v-model="checked"
      :name="product.name"
      type="checkbox"
      class="z-10 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-lg bg-gray-200 p-3 transition-colors duration-200 checked:bg-gray-800 checked:bg-[url(/check.svg)] checked:bg-center checked:bg-no-repeat checked:text-white hover:bg-gray-300 checked:hover:bg-gray-800"
    />
    <label
      :for="product.name"
      class="relative mb-1 flex cursor-pointer items-center overflow-hidden font-medium leading-none text-gray-800 transition duration-500 ease-out"
    >
      {{ product.name }}
      <Presence :initial="!checked">
        <Motion
          v-if="checked"
          tag="span"
          :initial="{ x: -250, scale: 2 }"
          :animate="{
            x: 0,
            scale: 1,
            transition: { scale: { delay: 0.3 } }
          }"
          :exit="{ opacity: 0 }"
          :transition="{ easing: [0.58, 0.02, 0.4, 0.97] }"
          class="absolute bottom-[5px] h-0.5 w-full rounded-full bg-gray-900"
        />
      </Presence>
    </label>
    <span
      :class="[
        'ml-auto h-3 w-3 rounded border-2',
        {
          'border-red-300': product.priority === 'LOW',
          'border-yellow-300': product.priority === 'MEDIUM',
          'border-green-300': product.priority === 'HIGH'
        }
      ]"
    ></span>
  </li>
</template>
