import React, {useContext} from 'react'
import Title from '../Atoms/Title'

import { UserContext } from '../../context/UserContext'

const AdminDashboard = () => {
  const { state: userState } = useContext(UserContext)

  return (
    <>
      <Title>Hello {userState.user?.firstName}, your Admin Dashboard:</Title>
      <div>
        Hello there
      </div>
    </>
  )
}

export default AdminDashboard