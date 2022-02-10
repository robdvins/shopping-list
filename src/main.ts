import ApolloClient from '@gql/index'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createApp, h, provide } from 'vue'
import App from './App.vue'
import './index.css'
import Router from './router'

const app = createApp({
  setup() {
    provide(DefaultApolloClient, ApolloClient)
  },
  render: () => h(App)
})

app.use(Router)
app.mount('#app')
