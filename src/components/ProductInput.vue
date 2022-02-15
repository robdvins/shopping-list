<script setup lang="ts">
import {
  CreateProduct,
  CreateProductResponse,
  ProductsByList,
  ProductsByListResponse
} from '@gql/interactions'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/outline'
import { useMutation } from '@vue/apollo-composable'
import { Motion, Presence } from 'motion/vue'
import { nextTick, reactive, ref } from 'vue'
import PriorityIcon from './PriorityIcon.vue'

const props = defineProps<{ faunaId: string; ownId: string }>()
const emit = defineEmits({
  created: () => true
})

const priorities = ['Low', 'Medium', 'High']
const el = ref<HTMLInputElement | null>(null)
const newProduct = reactive({
  name: '',
  priority: priorities[0]
})

const { mutate } = useMutation<CreateProductResponse>(CreateProduct, () => ({
  update(cache, { data }) {
    if (!data) return
    let cached = cache.readQuery<ProductsByListResponse>({
      query: ProductsByList,
      variables: { list_id: props.ownId }
    })
    cached = JSON.parse(JSON.stringify(cached))
    if (!cached) return

    cached.products.list = [data.created, ...cached.products.list]
    cache.writeQuery({ query: ProductsByList, variables: { list_id: props.ownId }, data: cached })
    newProduct.name = ''
  }
}))

async function createProduct(event: KeyboardEvent) {
  const target = event.target as HTMLInputElement
  target.blur()
  emit('created')

  await mutate({
    id: props.faunaId,
    name: newProduct.name,
    priority: newProduct.priority.toUpperCase()
  })
}

function restoreFocus() {
  nextTick(() => {
    if (!el.value) return
    el.value.focus()
  })
}
</script>

<template>
  <div
    class="group relative my-3 flex rounded-xl bg-gray-300 transition-all duration-500 ease-out focus-within:z-10 focus-within:bg-white focus-within:shadow-2xl hover:bg-gray-400/40 focus-within:hover:bg-white"
  >
    <input
      ref="el"
      v-model="newProduct.name"
      type="text"
      placeholder="Add new product"
      maxlength="40"
      class="w-full rounded-xl bg-transparent py-3 pl-3 pr-36 placeholder:text-gray-600 focus:outline-none group-focus-within:placeholder:text-gray-400"
      @keyup.enter="createProduct"
    />
    <div
      class="invisible absolute right-0 flex h-full items-center transition-all duration-100 ease-in group-focus-within:visible"
    >
      <Listbox v-model="newProduct.priority" as="div" class="relative inline-flex items-center">
        <ListboxButton
          class="mr-3 inline-flex min-w-0 items-center rounded-md bg-gray-200 py-1 px-3 text-sm capitalize transition-[width] duration-300 ease-in-out"
        >
          <PriorityIcon class="mr-2" :priority="newProduct.priority" />
          {{ newProduct.priority }}
          <ChevronDownIcon class="ml-3 h-4 w-4 text-gray-500" />
        </ListboxButton>
        <Presence>
          <ListboxOptions
            as="template"
            class="absolute right-1.5 top-[3.25rem] w-36 space-y-1 rounded-lg bg-white p-1 shadow-xl focus:outline-none"
          >
            <Motion
              tag="ul"
              :initial="{ y: -20, opacity: 0 }"
              :animate="{ y: 0, opacity: 1 }"
              :exit="{ y: 0, opacity: 0 }"
            >
              <ListboxOption
                v-for="(item, i) in priorities"
                :key="i"
                class="flex cursor-pointer items-center rounded-md py-1 px-3 text-sm transition-colors duration-200 ease-in hover:bg-gray-100"
                :value="item"
                @click="restoreFocus"
              >
                <PriorityIcon class="mr-2" :priority="item" />
                {{ item }}
              </ListboxOption>
            </Motion>
          </ListboxOptions>
        </Presence>
      </Listbox>
    </div>
  </div>
</template>
