import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { funcMerge } from '@/utils/funcHelper'

function createService() {
  const service = axios.create()

  service.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  )

  service.interceptors.response.use(
    (response) => {
      const apiData = response.data

      const responseType = response.request?.responseType

      if (responseType === 'blob' || responseType === 'arraybuffer') return apiData

      return apiData
      // const statusCode = apiData.statusCode
      // if (statusCode === undefined) {
      //   return Promise.reject(new Error('Something error!'))
      // }
      // switch (statusCode) {
      //   case 200:
      //     return apiData
      //     break
      //   case 401:
      //     return Promise.reject(new Error('Authentication!'))
      //   default:
      //     return Promise.reject(new Error('Error'))
      //     break
      // }
    },
    (error) => {
      console.log('error :>> ', error)
    }
  )

  return service
}

function createRequest(service: AxiosInstance) {
  return function <T>(config: AxiosRequestConfig<any>): Promise<any> {
    // const token =''
    const configDefault: any = {
      header: {
        Authorization: '',
        'Content-Type': 'application/json'
      },
      timeout: 5000,
      baseURL: import.meta.env.VITE_BASE_API
    }
    const lastConfig = funcMerge(configDefault, config)
    return service(lastConfig)
  }
}
const service = createService()
export const request = createRequest(service)
