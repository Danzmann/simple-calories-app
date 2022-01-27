import React, {useContext} from 'react'
import Title from '../Atoms/Title'

import { UserContext } from '../../context/UserContext'

import ProductsListing from '../Organisms/ProductsListing'

const UserView = () => {
  const { state: userState } = useContext(UserContext)

  return (
    <>
      <Title>Hello {userState.user?.firstName}, your Food Entries</Title>
      <ProductsListing />
    </>
  )
}

export default UserView