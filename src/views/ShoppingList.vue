<script setup lang="ts">
import { CREATE_PRODUCT } from '@gql/mutations'
import { GET_LIST_BY_ID } from '@gql/queries'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from '@headlessui/vue'
// import { SearchIcon } from '@heroicons/vue/outline'
import { useMutation, useQuery, useResult } from '@vue/apollo-composable'
import { Motion, Presence } from 'motion/vue'
import { computed, ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'

const props = defineProps<{ id: string }>()

interface ShoppingList {
  shopping_list: {
    _id: string
    id: string
    name: string
    products: {
      list: {
        name: string
        priority: 'LOW' | 'MEDIUM' | 'HIGH'
        purchased: boolean
        quantity: number
      }[]
    }
  }
}

const newTaskName = ref<string>('')
const priority = ref<string>('')
const { result } = useQuery<ShoppingList>(GET_LIST_BY_ID, { id: props.id })
const products = useResult(result, [], (data) => data.shopping_list.products.list)

const pendingList = computed(() => {
  return products.value.filter((product) => !product.purchased)
})

const purchasedList = computed(() => {
  return products.value.filter((product) => product.purchased)
})

const { mutate: createProduct } = useMutation(CREATE_PRODUCT, () => ({
  variables: {
    name: newTaskName.value,
    priority: priority.value,
    quantity: 1,
    list_id: result.value?.shopping_list._id
  },
  update: (cache, { data: { product } }) => {
    let data = cache.readQuery<ShoppingList>({ query: GET_LIST_BY_ID, variables: { id: props.id } })
    data = JSON.parse(JSON.stringify(data)) as ShoppingList
    data.shopping_list.products.list.push(product)
    cache.writeQuery({ query: GET_LIST_BY_ID, variables: { id: props.id }, data })
  }
}))
</script>

<template>
  <TabGroup as="div" class="flex h-full flex-col items-center overflow-x-hidden overflow-y-scroll">
    <div class="sticky top-0 z-10 flex w-full justify-center bg-gray-100 p-4">
      <div class="w-full max-w-md space-y-4">
        <h1 class="text-2xl">🛒 {{ result?.shopping_list.name }}</h1>
        <div class="relative flex rounded-xl bg-gray-200 py-3">
          <!-- <span class="absolute inset-y-0 left-0 flex items-center pl-4">
            <SearchIcon class="h-5 w-5 text-gray-500" />
          </span> -->
          <input
            v-model="newTaskName"
            class="block w-full pl-12 pr-3 shadow-sm placeholder:text-gray-500 focus:outline-none"
            placeholder="Add a new product"
            type="text"
            name="search"
            @keyup.enter="createProduct(), (newTaskName = '')"
          />
          <Listbox v-model="priority">
            <ListboxButton>Priority</ListboxButton>
            <ListboxOptions>
              <ListboxOption value="LOW">LOW</ListboxOption>
              <ListboxOption value="MEDIUM">MEDIUM</ListboxOption>
              <ListboxOption value="HIGH">HIGH</ListboxOption>
            </ListboxOptions>
          </Listbox>
        </div>
        <TabList class="rounded-xl bg-gray-200 p-1" #="{ selectedIndex }">
          <div class="relative grid grid-cols-2">
            <div
              :style="`transform: translateX(calc(100% * ${selectedIndex}))`"
              class="absolute inset-y-0 w-1/2 duration-300 ease-[cubic-bezier(0.97,0.04,0.01,1.02)]"
            >
              <span class="block h-full w-full rounded-lg bg-white"></span>
            </div>
            <Tab as="template">
              <button class="z-10 flex justify-center py-2 focus:outline-none">Pending</button>
            </Tab>
            <Tab as="template">
              <button class="z-10 flex justify-center py-2 focus:outline-none">Purchased</button>
            </Tab>
          </div>
        </TabList>
      </div>
    </div>
    <TabPanels class="relative flex h-full w-full max-w-md justify-center">
      <Presence :exit-before-enter="true">
        <TabPanel as="template" #="{ selected }">
          <Motion
            v-if="selected"
            class="absolute w-full max-w-md px-4 sm:px-0"
            :initial="selected ? { opacity: 0, x: -300 } : { opacity: 0, x: 300 }"
            :animate="{ opacity: 1, x: 0 }"
            :exit="selected ? { opacity: 0, x: -300 } : { opacity: 0, x: 300 }"
          >
            <ul class="space-y-2 pb-4">
              <ProductCard v-for="(product, i) in pendingList" :key="i" :product="product" />
            </ul>
          </Motion>
        </TabPanel>
      </Presence>
      <Presence :exit-before-enter="true">
        <TabPanel as="template" #="{ selected }">
          <Motion
            v-if="selected"
            class="absolute w-full max-w-md px-4 sm:px-0"
            :initial="selected ? { opacity: 0, x: 300 } : { opacity: 0, x: -300 }"
            :animate="{ opacity: 1, x: 0 }"
            :exit="selected ? { opacity: 0, x: 300 } : { opacity: 0, x: -300 }"
          >
            <ul class="space-y-2 pb-4">
              <ProductCard v-for="(product, i) in purchasedList" :key="i" :product="product" />
            </ul>
          </Motion>
        </TabPanel>
      </Presence>
    </TabPanels>
  </TabGroup>
</template>
