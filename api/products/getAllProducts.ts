import axios from 'axios'
import { getBackendApi } from '../../utils/apiConfig'

// Based on cookie refresh token, will get the products for the user, if admin, will return all products for all users
// :todo Implement pagination
export const getProducts = async () => {
  try {
    const response = await axios.get(`${getBackendApi()}/products/foodEntries`, {
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