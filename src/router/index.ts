import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from './routes/home'
import ShoppingList from './routes/shopping-list'

const routes: RouteRecordRaw[] = [Home, ShoppingList]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
