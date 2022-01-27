import React, { Dispatch, SetStateAction, useState } from "react"
import { ProductType } from '../types/product.type'

interface ProductsProps {
  state: { products: ProductType[] },
  setState: Dispatch<SetStateAction<{ products: ProductType[]}>>
}

const ProductsContext = React.createContext<ProductsProps>({} as ProductsProps)

export let initialState = {
  products: [
    {
      _id: '',
      userId: '',
      username: '',
      foodName: '',
      foodPrice: 0,
      caloricValue: 0,
      eatingTime: '',
    },
  ],
}

const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<{ products: ProductType[] }>(initialState)

  return (
    <ProductsContext.Provider value={{ state, setState }}>
      {children}
    </ProductsContext.Provider>
  )
}

export { ProductsContext, ProductsProvider }