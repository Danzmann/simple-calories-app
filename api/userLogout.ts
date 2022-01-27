import axios, { AxiosResponse } from 'axios'
import { getBackendApi } from '../utils/apiConfig'

export const getUserLogout = async (token: string) => {
  try {
    const response: AxiosResponse = await axios.get(`${getBackendApi()}/users/logout`,  {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      },
    )

    if (response.data.success) {
      return { logout: true }
    }
    return { errCode: 'GENERAL_ERROR', errMessage: 'Something wrong has happened!' }
  } catch (err) {
    console.log(err)
    return { errCode: 'GENERAL_ERROR', errMessage: 'Something wrong has happened!' }
  }
}