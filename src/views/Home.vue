<script setup lang="ts">
import { CreateList, CreateListResponse } from '@gql/interactions'
import { useMutation } from '@vue/apollo-composable'
import { uid } from 'uid'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const list = reactive({
  id: '',
  name: '',
  validId: false,
  validName: false
})

const router = useRouter()

function goToList() {
  if (!/^[a-z0-9]{11}$/gim.test(list.id)) {
    list.validId = true

    setTimeout(() => {
      list.validId = false
    }, 1000)

    return
  }

  router.push({
    name: 'ShoppingList',
    params: {
      id: list.id
    }
  })
}

const { mutate } = useMutation<CreateListResponse>(CreateList)
async function createList() {
  if (!list.name) {
    list.validName = true

    setTimeout(() => {
      list.validName = false
    }, 1000)

    return
  }

  const response = await mutate({ id: uid(), name: list.name })
  if (!response) return // DO nothing for now.

  router.push({
    name: 'ShoppingList',
    params: {
      id: response.data?.created.id
    }
  })
}
</script>

<template>
  <div class="mx-auto mt-32 flex w-full max-w-md flex-col space-y-10 px-4">
    <h1 class="text-5xl font-bold sm:text-6xl">
      <span class="bg-gradient-to-tr from-gray-200 to-gray-400 bg-clip-text text-transparent">
        A more human
      </span>
      <br />
      shopping list
    </h1>
    <div class="flex flex-col space-y-5">
      <input
        v-model="list.id"
        type="text"
        placeholder="Enter list id"
        :class="['text-3xl placeholder:text-gray-300 focus:outline-none', { 'animate-shake': list.validId }]"
      />
      <button
        class="inline-flex items-center justify-center rounded-full bg-gray-800 px-6 py-3.5 text-base font-semibold text-white shadow-lg"
        @click="goToList"
      >
        Go to list
      </button>
    </div>
    <div class="flex items-center space-x-3">
      <div class="flex w-full items-center"><hr class="h-px w-full border-0 bg-gray-300" /></div>
      <span class="mb-1.5 text-lg text-gray-500">or</span>
      <div class="flex w-full items-center"><hr class="h-px w-full border-0 bg-gray-300" /></div>
    </div>
    <div class="flex flex-col space-y-5">
      <input
        v-model="list.name"
        type="text"
        placeholder="Enter list name"
        :class="[
          'text-3xl placeholder:text-gray-300 focus:outline-none',
          { 'animate-shake': list.validName }
        ]"
      />
      <button
        class="inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/30"
        @click="createList"
      >
        Create new list
      </button>
    </div>
  </div>
</template>
