import axios, {AxiosResponse} from "axios";
import type { NextApiRequest, NextApiResponse } from 'next'

import { isAxiosError } from '../../utils/apiConfig'
import { ApiLoginData } from '../../types/api.types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiLoginData>
) {
  const { email, password } = req.query

  try {
    const response: AxiosResponse = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/users/login`,
      {
        username: email,
        password,
      }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      },
    )

    const { token, user, isAdmin } = response.data
    res.status(200).json({
      token,
      user,
      isAdmin,
    })
  } catch (err) {
    if (isAxiosError(err) && err.response) {
      if (err.response.status === 400) {
        res.status(400).json({ errCode: 'INCORRECT_DATA', errMessage: 'Please fill all the fields correctly!' })
        return
      }
      if (err.response.status === 401) {
        res.status(401).json({ errCode: 'INVALID_DATA', errMessage: 'Invalid email or password' })
        return
      }
    }
    res.status(500).json({ errCode: 'GENERAL_ERROR', errMessage: 'Something wrong has happened!' })
  }
}