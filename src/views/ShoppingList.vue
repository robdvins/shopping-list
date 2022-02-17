<script setup lang="ts">
import ProductCard from '@components/ProductCard.vue'
import ProductInput from '@components/ProductInput.vue'
import ListTransition from '@components/ListTransition.vue'
import { ListById, ListByIdResponse, ProductsByList, ProductsByListResponse } from '@gql/interactions'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { useQuery, useResult } from '@vue/apollo-composable'
import { computed, ref } from 'vue'

const props = defineProps<{ id: string }>()

const { result: list } = useQuery<ListByIdResponse>(ListById, { list_id: props.id })
const productsList = useQuery<ProductsByListResponse>(ProductsByList, { list_id: props.id })
const products = useResult(productsList.result, [], (data) => data.products.list)

const unpurchased = computed(() => {
  return products.value.filter((product) => !product.purchased)
})
const purchased = computed(() => {
  return products.value.filter((product) => product.purchased)
})

// This way is the closest to the animation I was looking for.
const moveDelay = ref('delay-100')
</script>

<template>
  <div class="w-full overflow-y-scroll px-4">
    <div class="mx-auto mt-14 w-full max-w-md">
      <h1 class="text-2xl font-bold">{{ list?.info.name }}</h1>
      <ProductInput :fauna-id="list?.info._id || ''" :own-id="id" @created="moveDelay = 'delay-100'" />
      <TabGroup as="div" class="h-full">
        <TabList class="mb-3 rounded-xl bg-gray-300 p-1" #="{ selectedIndex }">
          <div class="relative grid grid-cols-2">
            <div
              :style="`transform: translateX(calc(100% * ${selectedIndex}))`"
              class="absolute inset-y-0 z-0 w-1/2 duration-300 ease-[cubic-bezier(0.97,0.04,0.01,1.02)]"
            >
              <span class="block h-full w-full rounded-lg bg-white"></span>
            </div>
            <Tab as="template">
              <button class="relative flex justify-center py-2 focus:outline-none">Pending</button>
            </Tab>
            <Tab as="template">
              <button class="relative flex justify-center py-2 focus:outline-none">Purchased</button>
            </Tab>
          </div>
        </TabList>
        <TabPanels class="min-h-full">
          <TabPanel class="min-h-full focus:outline-none">
            <ListTransition tag="ul" :move-delay="moveDelay" class="relative min-h-full space-y-3 pb-4">
              <li
                v-for="product in unpurchased"
                :key="product._id"
                class="flex w-full items-center rounded-xl bg-white p-3"
              >
                <ProductCard :own-id="id" :product="product" @deleted="moveDelay = 'delay-[800ms]'" />
              </li>
            </ListTransition>
          </TabPanel>
          <TabPanel class="min-h-full focus:outline-none">
            <ListTransition tag="ul" :move-delay="moveDelay" class="relative min-h-full space-y-3 pb-4">
              <li
                v-for="product in purchased"
                :key="product._id"
                class="flex w-full items-center rounded-xl bg-white p-3"
              >
                <ProductCard :own-id="id" :product="product" @deleted="moveDelay = 'delay-[800ms]'" />
              </li>
            </ListTransition>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>
