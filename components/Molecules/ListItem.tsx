import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import {
  Col,
  Input,
  List,
  Button,
  Row,
} from 'antd'
import Swal from 'sweetalert2'

import { UserContext } from '../../context/UserContext'
import { ProductsContext } from '../../context/ProductsContext'

import { addProducts } from '../../api/products/addProduct'

import { ProductType, ProductTypeCreate } from '../../types/product.type'
import { getSuccessToastSwal, getErrorSwal } from '../../utils/swalUtils'

const DataWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledRow = styled(Row)`
  margin: 5px 0;
`

const StyledCol = styled(Col)`
  margin: 0 5px;
`

const productCreator = async (productData: ProductTypeCreate, userId: string) => {
  console.log(productData)
  console.log(userId)
  if (!userId) {
    return
  }
  if (!productData.foodName || !productData.caloricValue) {
    Swal.fire(getErrorSwal('Food name and caloric values are required'))
    return
  }
  const res = await addProducts(productData, userId)
  if (res.errCode) {
    Swal.fire(getErrorSwal(res.errMessage))
    return null
  }
  return res
}

const DataView = ({
  changeable,
  data,
  dataChanger
}: {
  changeable: boolean
  data: string | number
  dataChanger: (data: string | number) => void
}) => (
  changeable ? <Input value={data} onChange={(e) => dataChanger(e.target.value)} /> : <span>{data}</span>
)

const ListItem = ({ item }: { item: ProductType }) => {
  const [foodName, setFoodName] = useState<string>(item.foodName)
  const [foodPrice, setFoodPrice] = useState<number>(item.foodPrice)
  const [caloricValue, setCaloricValue] = useState<number>(item.caloricValue)
  const [eatingTime, setEatingTime] = useState<string>(item.eatingTime)

  const { state: userState } = useContext(UserContext)
  const { user: { isAdmin, id: userId } = {} } = userState
  const { setState: setProductsState } = useContext(ProductsContext)

  const isAddItem = item.userId === ''
  const isChangeable = isAddItem || isAdmin

  const AddItem = async () => {
    const response = await productCreator({
      foodName,
      foodPrice,
      caloricValue,
      eatingTime,
    }, userId || '')
    if (response.success) {
      Swal.fire(getSuccessToastSwal('Food entry added successfully'))
      const newProduct = response.sEntry
      setProductsState(oldValue => ({ products: [ ...oldValue.products, newProduct ] }))
    }
  }

  return (
    <List.Item
      actions={
        isAddItem ? [
          <Button type="primary" size="large" onClick={() => AddItem()}> Add </Button>
        ] : isAdmin ? [
          <Button type="primary" size="large" onClick={() => {}}> Save </Button>,
          <Button type="primary" size="large" onClick={() => {}}> Delete </Button>
        ] : []}
    >
      <DataWrapper>
        {isAdmin &&
          <StyledRow>
            <span>User: </span>
            <span>{item.username}</span>
          </StyledRow>
        }
        <StyledRow>
          <StyledCol span={10}>
            <span>Food: </span>
            {/* @ts-ignore */}
            <DataView changeable={isChangeable} data={foodName} dataChanger={setFoodName} />
          </StyledCol>
          <StyledCol span={10}>
            <span>Calories: </span>
            {/* @ts-ignore */}
            <DataView changeable={isChangeable} data={caloricValue} dataChanger={setCaloricValue} />
          </StyledCol>
        </StyledRow>
        <StyledRow>
          <StyledCol span={10}>
            <span>Price: </span>
            {/* @ts-ignore */}
            <DataView changeable={isChangeable} data={foodPrice} dataChanger={setFoodPrice} />
          </StyledCol>
          <StyledCol span={10}>
            <span>Consumption Time: </span>
            {/* @ts-ignore */}
            <DataView changeable={isChangeable} data={eatingTime} dataChanger={setEatingTime} />
          </StyledCol>
        </StyledRow>
      </DataWrapper>
    </List.Item>
  )
}

export default ListItem