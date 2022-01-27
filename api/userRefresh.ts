import axios, { AxiosResponse } from 'axios'
import { getBackendApi, isAxiosError } from '../utils/apiConfig'

export const postUserRefresh = async () => {
  try {
    const response: AxiosResponse = await axios.post(`${getBackendApi()}/users/refreshToken`, {}, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    const { token: responseToken, user } = response.data
    return {
      token: responseToken,
      user,
    }
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      if (err.response.status === 401) {
        return { errCode: 'LOGGED_OUT', errMessage: 'You have already been logged out' }
      }
    }
    console.error(err)
    return { errCode: 'GENERAL_ERROR', errMessage: 'Something wrong has happened!' }
  }
}