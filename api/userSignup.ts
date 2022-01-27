import axios, { AxiosResponse } from 'axios'
import { getBackendApi, isAxiosError } from '../utils/apiConfig'

export const postUserSignup = async (
  username: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  try {
    const response: AxiosResponse = await axios.post(`${getBackendApi()}/users/signup`,
      {
        username,
        password,
        firstName,
        lastName,
      }, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )

    const { token, user, isAdmin } = response.data
    return {
      token,
      user,
      isAdmin,
    }
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      if (err.response.status === 400) {
        return { errCode: 'INCORRECT_DATA', errMessage: 'Please fill all the fields correctly!' }
      }
    }
    console.log(err)
    return { errCode: 'GENERAL_ERROR', errMessage: 'Something wrong has happened!' }
  }
}