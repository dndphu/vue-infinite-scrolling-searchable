<script setup lang="ts">
import { useInfiniteScroll, useDebounceFn } from '@vueuse/core'
import { getApiProducts, getApiSearchProducts } from '@/api/products'
import type { IParamProduct, IParamSearchProduct } from '@/api/products'

interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
}
interface ProductResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}


const products = ref()
const params = reactive({
  limit: 20,
  skip: 0,
  total: 0
})
const paramsSearch = reactive({
  limit: 20,
  skip: 0,
  total: 0,
  q: ''
})

const listRef = ref<HTMLElement | null>()
const isLoading = ref()
const isSearching = computed(() => !!paramsSearch.q)

useInfiniteScroll(
  listRef,
  async () => {
    if (!isLoading.value && !isSearching.value && products.value && params.skip < params.total) {
      params.skip = params.skip + 20
      const resProduct = await getProducts(params)
      await initData(resProduct)
    }
  },
  { distance: 20 }
)
async function getProducts(data: IParamProduct) {
  isLoading.value = true
  try {
    const res = await getApiProducts(data)
    isLoading.value = false
    return res
  } catch (error) {
    error
  }
}
async function getProductSearch(data: IParamSearchProduct) {
  isLoading.value = true
  try {
    const res = await getApiSearchProducts(data)
    isLoading.value = false
    return res
  } catch (error) {
    console.log('error :>> ', error)
  }
}
const onSearch = useDebounceFn(
  async () => {
    let data
    if (!isSearching.value) {
      //reset to products
      params.limit = 20
      params.skip = 0
      data = await getProducts(params)
    } else {
      data = await getProductSearch(paramsSearch)
    }

    await initData(data)
  },
  600,
  { maxWait: 5000 }
)

async function initData(data: ProductResponse) {
  if (isSearching.value) {
    products.value = data.products
    return
  }
  products.value = params?.skip === 0 ? data?.products : [...products.value, ...data.products]
  params.limit = data?.limit
  params.skip = data?.skip
  params.total = data?.total
}
onBeforeMount(async () => {
  const data = await getProducts(params)
  await initData(data)
})
</script>

<template>
  <div ref="listRef" class="container">
    <div class="product-page">
      <div class="search">
        <input
          @input="onSearch"
          v-model="paramsSearch.q"
          type="text"
          placeholder="input to search"
        />
        <i>* disable scroll infinite when searching</i>
      </div>
      <div class="products__wrapper">
        <div v-for="(item, index) in products" :key="index" class="products">
          <img :src="item?.thumbnail" :alt="item?.title" />
          <span class="products__title">{{ item?.title }}</span>
          <div class="products__content">
            <span class="price"> {{ item?.price }} USD </span>
            <div class="description">
              {{ item?.description }}
            </div>
          </div>
        </div>
        <div v-if="!isLoading && (!products || !products.length)">Not Found Data</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: 100vh;
  overflow: auto;
}
.product-page {
  padding: 1rem;
  max-width: 1280px;
  margin: auto;
}
.search {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  input {
    max-width: 300px;
    display: block;
    font-size: 0.9rem;
    padding: 0.5em 1em 0.4em;
    border: 1px solid #e2e2e3;
    border-radius: 4px;
    outline: none;
    background: #ffffff;
    color: #000000;
    min-width: 20rem;
    margin: 0.5rem 0;
  }
}
.products {
  &__wrapper {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: auto;
    @media screen and (min-width: 576px) {
      grid-template-columns: 1fr 1fr;
    }
    @media screen and (min-width: 768px) {
      grid-template-columns: 1fr 1fr 1fr;
    }
    @media screen and (min-width: 1280px) {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
  }
  height: fit-content;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #ffffff;
  box-shadow: 0 4px 20px #2c65901a;
  cursor: pointer;
  color: #000000;
  overflow: hidden;
  box-sizing: border-box;

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 600/300;
    object-fit: cover;
  }
  &__title {
    font-weight: 600;
    margin-top: 8px;
  }
  &__content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .price {
      color: red;
      padding: 8px 0;
    }
    .description {
      color: #000000;
      display: block;
      display: -webkit-box;
      font-size: 16px;
      line-height: 1.6;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
