import React, { useState, useContext } from 'react'
import { Form, Input, Button } from 'antd'
import styled from 'styled-components'
import Swal from 'sweetalert2'

import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import AppWrapper from '../components/Layout/AppWrapper'
import Title from '../components/Atoms/Title'

import { UserContext } from '../context/UserContext'

import { ApiLoginData } from '../types/api.types'

import { postUserLogin } from '../api/userLogin'

const StyledButton = styled(Button)`
  margin: 0 12px;
`

async function loginFetcher(email: string, password: string): Promise<ApiLoginData | null> {
  const res = await postUserLogin(email, password)
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

const Login: NextPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { state: userContext, setState: setUserContext } = useContext(UserContext)

  const router = useRouter()

  const formSubmitHandler = async () => {
    setLoading(true)

    const response = await loginFetcher(email, password)
    setLoading(false)
    if (!response) return

    setUserContext(oldValues => ({
      ...oldValues,
      token: response.token,
      user: {
        id: response.user._id,
        ...response.user
      },
    }))
    router.push('/')
  }

  return (
    <AppWrapper>
      <Title> Enter your user details </Title>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={formSubmitHandler}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
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
            {loading ? 'Logging in...' : 'Login'}
          </StyledButton>

          <StyledButton type="ghost" onClick={() => router.push('/signup')}>
            Signup
          </StyledButton>
        </Form.Item>
      </Form>
    </AppWrapper>
  )
}

export default Login
