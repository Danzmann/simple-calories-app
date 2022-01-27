import React, { useCallback, useContext, useEffect } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'

import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'

import AppWrapper from '../components/Layout/AppWrapper'
import UserView from '../components/Layout/UserView'

import { UserContext, initialState as userInitialState } from '../context/UserContext'

import { postUserRefresh } from '../api/userRefresh'
import { getUserLogout } from '../api/userLogout'

import { ApiLoginData } from '../types/api.types'
import AdminDashboard from "../components/Layout/AdminDashboard";

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

const LogoutButton = styled(Button)`
  margin-top: 30px;
`

async function refreshTokenFetcher(): Promise<ApiLoginData | null> {
  const res = await postUserRefresh()
  if (res.errCode) return null

  return res
}

async function logoutFetcher(token: string | undefined): Promise<{ logout?: boolean } | null> {
  if (!!token) {
    const res = await getUserLogout(token)
    if (res.errCode) return null

    return res
  } else {
    return { logout: true }
  }
}

const Home: NextPage = () => {
  const { state: userState, setState: setUserState } = useContext(UserContext)

  const router = useRouter()

  const logout = async () => {
    const response = await logoutFetcher(userState.token)
    if (!!response && response.logout) {
      setUserState(userInitialState)
    }
  }

  const verifyUser = useCallback(async () => {
    const response = await refreshTokenFetcher()

    if (!!response) {
      const { token, user } = response
      setUserState(oldValues => {
        return { ...oldValues, token, user: {
          ...oldValues.user,
          ...user,
          id: user._id,
        } }
      })
    } else {
      setUserState(userInitialState)
    }
    // call refreshToken every 5 minutes to renew the authentication token.
    setTimeout(verifyUser, 5 * 60 * 1000)
  }, [setUserState])

  useEffect(() => {
    verifyUser()
  }, [verifyUser])

  return (
    <AppWrapper>
      <Head>
        <title>Calories App</title>
        <meta name="description" content="Calories tracking application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>Calories Tracking App</h2>

      {!!userState.token && userState.user ? (
        <>
          {userState.user.isAdmin ? (
            <AdminDashboard />
          ) : (
            <UserView />
          )}
          <LogoutButton
            type="primary"
            size="large"
            onClick={() => logout()}
          >
            Logout
          </LogoutButton>
        </>
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
