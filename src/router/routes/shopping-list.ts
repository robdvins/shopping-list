import { RouteRecordRaw } from 'vue-router'

const ShoppingList = () => import('@views/ShoppingList.vue')

const ShoppingListRoute: RouteRecordRaw = {
  path: '/list/:id',
  name: 'ShoppingList',
  component: ShoppingList,
  props: true
}

export default ShoppingListRoute
