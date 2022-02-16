<script setup lang="ts">
import {
  DeleteProduct,
  DeleteProductResponse,
  ProductsByList,
  ProductsByListResponse,
  UpdateProduct,
  UpdateProductResponse
} from '@gql/interactions'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { DotsVerticalIcon, TrashIcon } from '@heroicons/vue/outline'
import { useMutation } from '@vue/apollo-composable'
import { Motion, Presence } from 'motion/vue'
import { ref } from 'vue'
import PriorityIcon from './PriorityIcon.vue'

interface Product {
  ownId: string
  product: {
    _id: string
    name: string
    priority: 'LOW' | 'MEDIUM' | 'HIGH'
    purchased: boolean
  }
}
const props = defineProps<Product>()
const emit = defineEmits({
  deleted: () => true
})

const checked = ref(props.product.purchased)

const { mutate: deleteProduct } = useMutation<DeleteProductResponse>(DeleteProduct, () => ({
  variables: { id: props.product._id },
  update(cache, { data }) {
    if (!data) return

    let cached = cache.readQuery<ProductsByListResponse>({
      query: ProductsByList,
      variables: { list_id: props.ownId }
    })
    cached = JSON.parse(JSON.stringify(cached))
    if (!cached) return

    const i = cached.products.list.findIndex((item) => item._id === data.deleted._id)
    if (i < 0) return

    emit('deleted')
    cached.products.list.splice(i, 1)
    cache.writeQuery({ query: ProductsByList, variables: { list_id: props.ownId }, data: cached })
  }
}))

const { mutate: updateProduct } = useMutation<UpdateProductResponse>(UpdateProduct, () => ({
  variables: { ...props.product, id: props.product._id, purchased: checked.value },
  update(cache, { data }) {
    if (!data) return

    let cached = cache.readQuery<ProductsByListResponse>({
      query: ProductsByList,
      variables: { list_id: props.ownId }
    })
    cached = JSON.parse(JSON.stringify(cached))
    if (!cached) return

    const i = cached.products.list.findIndex((item) => item._id === data.updated._id)
    if (i < 0) return

    emit('deleted')
    cached.products.list[i].purchased = checked.value
    cache.writeQuery({ query: ProductsByList, variables: { list_id: props.ownId }, data: cached })
  }
}))
</script>

<template>
  <input
    :id="product.name"
    v-model="checked"
    :name="product.name"
    type="checkbox"
    class="z-10 mr-2 h-4 w-4 cursor-pointer appearance-none rounded-lg bg-gray-200 p-3 transition-colors duration-200 checked:bg-gray-800 checked:bg-[url(/check.svg)] checked:bg-center checked:bg-no-repeat checked:text-white hover:bg-gray-300 checked:hover:bg-gray-800"
    @change="updateProduct"
  />
  <label
    :for="product.name"
    class="relative flex cursor-pointer items-center overflow-hidden font-medium text-gray-800 transition duration-500 ease-out"
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
        class="absolute top-[11px] h-0.5 w-full rounded-full bg-gray-900 sm:top-[13px]"
      />
    </Presence>
  </label>
  <PriorityIcon class="ml-auto" :priority="product.priority" />
  <Menu as="div" class="relative ml-3 inline-flex h-full">
    <MenuButton class="rounded-md bg-gray-200 p-1">
      <DotsVerticalIcon class="h-5 w-5" />
    </MenuButton>
    <MenuItems as="template">
      <Presence>
        <Motion
          :initial="{ y: -3, opacity: 0 }"
          :animate="{ y: 0, opacity: 1 }"
          :exit="{ y: -3, opacity: 0 }"
          :transition="{ duration: 0.3 }"
          class="absolute -bottom-[3.25rem] -right-3 z-20 w-32 rounded-lg bg-white p-1 shadow-xl"
        >
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                'z-10 flex w-full items-center rounded p-1 text-sm text-gray-900',
                { 'bg-gray-100': active }
              ]"
              @click="deleteProduct"
            >
              <TrashIcon class="mr-2 h-4 w-4" />
              Delete
            </button>
          </MenuItem>
        </Motion>
      </Presence>
    </MenuItems>
  </Menu>
</template>
