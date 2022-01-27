import React, { useContext, useEffect, useState } from 'react'
import { List } from 'antd'
import styled from 'styled-components'

import { UserContext } from '../../context/UserContext'
import { ProductsContext, initialState as productsInitialState } from '../../context/ProductsContext'

import ListItem from '../Molecules/ListItem'

import { getProducts } from '../../api/products/getAllProducts'

const StyledList = styled(List)`
  width: 80%;
`

const productsFetcher = async () => {
  const res = await getProducts()
  if (res.errCode) return null
  return res
}

const ProductsListing = () => {
  const [loading, setLoading] = useState(false);
  const { state: userState } = useContext(UserContext)
  const { state: productsState, setState: setProductsState } = useContext(ProductsContext)
  const { products } = productsState

  useEffect(() => {
    const getAllProducts = async () => {
      setLoading(true)
      const products = await productsFetcher()
      setLoading(false)
      if (!products) return

      setProductsState(oldValue => ({ products: [ ...productsInitialState.products, ...products ] }))
    }

    if (!!userState.token) getAllProducts()
  }, [userState])

  return (
    <StyledList
      size="large"
      loading={loading}
      bordered
      dataSource={products}
      // @ts-ignore
      renderItem={item => <ListItem item={item} />}
    />
  )
}

export default ProductsListing