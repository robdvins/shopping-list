import Home from '@views/Home.vue'
import { RouteRecordRaw } from 'vue-router'

const HomeRoute: RouteRecordRaw = {
  path: '/',
  name: 'Home',
  component: Home
}

export default HomeRoute
