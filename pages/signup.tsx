import React, {useContext, useState} from 'react'
import { Form, Input, Button } from 'antd'
import styled from 'styled-components'
import Swal from 'sweetalert2'

import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import AppWrapper from '../components/Layout/AppWrapper'
import Title from '../components/Atoms/Title'

import { UserContext } from '../context/UserContext'

import { ApiLoginData } from '../types/api.types'
import { postUserSignup } from '../api/userSignup'


const StyledButton = styled(Button)`
  margin: 0 10px;
`

async function signupFetcher(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<ApiLoginData | null> {
  const res = await postUserSignup(
    email,
    password,
    firstName,
    lastName,
  )
  if (res.errCode) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: res.errMessage,
    })
    return null
  }
  return res
}

const Signup: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState("")

  const { state: userContext, setState: setUserContext } = useContext(UserContext)

  const router = useRouter()

  const formSubmitHandler = async () => {
    setLoading(true)

    const response = await signupFetcher(
      email,
      password,
      firstName,
      lastName,
    )
    setLoading(false)
    if (!response) return

    setUserContext(oldValues => ({
      ...oldValues,
      token: response.token,
      user: {
        id: response.user._id,
        ...response.user,
      },
    }))
    router.push('/')
  }

  return (
    <AppWrapper>
      <Title>Create an Account</Title>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={formSubmitHandler}
        autoComplete="off"
      >
        <Form.Item
          label="Email (username)"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="last_name"
        >
          <Input
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 7, span: 18 }}>
          <StyledButton
            type="primary"
            htmlType="submit"
            disabled={loading}
          >
            {loading ? 'Signing you up...' : 'Signup'}
          </StyledButton>

          <StyledButton type="ghost" onClick={() => router.push('/login')}>
            Login
          </StyledButton>
        </Form.Item>
      </Form>
    </AppWrapper>
  )
}

export default Signup
