import ShoppingList from '@views/ShoppingList.vue'
import { RouteRecordRaw } from 'vue-router'

const ShoppingListRoute: RouteRecordRaw = {
  path: '/list/:id',
  name: 'ShoppingList',
  component: ShoppingList,
  props: true
}

export default ShoppingListRoute
