// https://router.vuejs.org/guide/advanced/meta.html
import 'vue-router'
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
  }
}
