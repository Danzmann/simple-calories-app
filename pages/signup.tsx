import React, { useState } from 'react'
import { Form, Input, Button } from 'antd'
import styled from 'styled-components'

import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import AppWrapper from '../components/AppWrapper'
import Title from '../components/Title'

const StyledButton = styled(Button)`
  margin: 0 10px;
`

const Signup: NextPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter()

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <AppWrapper>
      <Title>Create an Account</Title>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input value={email} onChange={e => setEmail(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="First Name"
          name="first_name"
        >
          <Input value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="last_name"
        >
          <Input value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 7, span: 18 }}>
          <StyledButton type="primary" htmlType="submit">
            Signup
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
