export type ProductTypeCreate = {
  foodName: string
  caloricValue: number
  eatingTime: string
  foodPrice: number
}

export interface ProductType extends ProductTypeCreate {
  _id: string
  userId: string
  username: string
}