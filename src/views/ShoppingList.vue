<script setup lang="ts">
import { ListById, ListByIdResponse, ProductsByList, ProductsByListResponse } from '@gql/interactions'
import { useQuery, useResult } from '@vue/apollo-composable'
import ProductInput from '@components/ProductInput.vue'
import ProductCard from '@components/ProductCard.vue'
import { ref } from 'vue'

const props = defineProps<{ id: string }>()

const { result: list } = useQuery<ListByIdResponse>(ListById, { list_id: props.id })
const productsList = useQuery<ProductsByListResponse>(ProductsByList, { list_id: props.id })
const products = useResult(productsList.result, [], (data) => data.products.list)

// This way is the closest to the animation I was looking for.
const moveDelay = ref('delay-100')
</script>

<template>
  <div class="w-full overflow-y-scroll px-4">
    <div class="mx-auto mt-14 w-full max-w-md">
      <h1 class="text-2xl font-bold">{{ list?.info.name }}</h1>
      <ProductInput :fauna-id="list?.info._id || ''" :own-id="id" @created="moveDelay = 'delay-100'" />
      <TransitionGroup
        tag="ul"
        enter-active-class="z-40 transition duration-[600ms] ease-[cubic-bezier(.18,.89,.32,1.28)] transform-gpu"
        enter-from-class="-translate-y-16 opacity-0"
        enter-to-class="transforom-none opacity-100"
        leave-active-class="absolute transition duration-[1500ms] ease-ease-[cubic-bezier(.6,-0.28,.74,.05)] transform-gpu"
        leave-from-class="transform-none opacity-100"
        leave-to-class="translate-y-4 rotate[4deg] blur-md opacity-0"
        :move-class="`transition-all duration-500 ${moveDelay} ease-[cubic-bezier(.18,.89,.32,1.28)] transform-gpu`"
        class="relative space-y-3 pb-4"
      >
        <li
          v-for="product in products"
          :key="product._id"
          class="flex w-full items-center rounded-xl bg-white p-3"
        >
          <ProductCard :own-id="id" :product="product" @deleted="moveDelay = 'delay-[800ms]'" />
        </li>
      </TransitionGroup>
    </div>
  </div>
</template>
