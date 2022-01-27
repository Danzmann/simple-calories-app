import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'

import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import AppWrapper from '../components/AppWrapper'

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 200px;
  width: 200px;
  
  h4 {
    text-align: center; 
  }
`

const Home: NextPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const router = useRouter()

  return (
    <AppWrapper>
      <Head>
        <title>Calories App</title>
        <meta name="description" content="Calories tracking application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>Calories Tracking App</h2>

      {isAuthenticated ? (
        <div>
          {/*Redirect here dude*/}
          Welcome
        </div>
      ) : (
        <ButtonsWrapper>
          <h4>Please Login/Signup to Continue</h4>
          <Button
            type="primary"
            size="large"
            onClick={() => router.push('/login')}
          >
            Log In
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={() => router.push('/signup')}
          >
            Sign Up
          </Button>
        </ButtonsWrapper>
      )}

    </AppWrapper>
  )
}

export default Home
