import axios from 'axios'
import { ProductTypeCreate } from '../../types/product.type'
import { getBackendApi } from '../../utils/apiConfig'

export const addProducts = async (productData: ProductTypeCreate, userId: string) => {
  try {
    const response = await axios.post(`${getBackendApi()}/products/foodEntries`, {
      ...productData,
      userId,
    }, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    return response.data
  } catch (err) {
    console.log(err)
    return { errCode: 'GENERAL_ERROR', errMessage: 'Something wrong has happened!' }
  }
}