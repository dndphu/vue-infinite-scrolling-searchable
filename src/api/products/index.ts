import { request } from "../utils/service";

export interface IParamProduct {
  total ?: string | number
  skip ?: string | number
  limit ?: string | number
}
export function getApiProducts(params?: IParamProduct){
   return request({
     url: 'products',
     method: 'get',
     params: params
   })

}

export interface IParamSearchProduct {
  q?: string
  total?: string | number
  skip?: string | number
  limit?: string | number
}
export function getApiSearchProducts(params?: IParamSearchProduct) {
  return request({
    url: 'products/search',
    method: 'get',
    params: params
  })
}