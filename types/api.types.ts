export type ApiLoginData = {
  success?: boolean
  // :todo this
  user?: any
  isAdmin?: boolean
  token?: string

  errCode?: string
  errMessage?: string
}