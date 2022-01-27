import axios, { AxiosResponse } from 'axios'
import { getBackendApi, isAxiosError } from '../utils/apiConfig'

export const postUserLogin = async (username: string, password: string) => {
  try {
    const response: AxiosResponse = await axios.post(`${getBackendApi()}/users/login`,
      {
        username,
        password,
      }, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    const { token, user } = response.data
    return {
      token,
      user,
    }
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      if (err.response.status === 400) {
        return { errCode: 'INCORRECT_DATA', errMessage: 'Please fill all the fields correctly!' }
      }
      if (err.response.status === 401) {
        return { errCode: 'INVALID_DATA', errMessage: 'Invalid email or password' }
      }
    }
    console.log(err)
    return { errCode: 'GENERAL_ERROR', errMessage: 'Something wrong has happened!' }
  }
}