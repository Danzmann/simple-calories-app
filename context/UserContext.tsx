import React, { Dispatch, SetStateAction, useState } from "react"

// :todo this
type UserType = {
  token?: string,
  user?: {
    firstName: string,
    lastName: string,
    username: string,
  },
  isAdmin?: boolean,
}

interface UserProps {
  state: UserType,
  setState: Dispatch<SetStateAction<UserType>>
}

const UserContext = React.createContext<UserProps>({} as UserProps)

let initialState = {
  token: '',
  user: {
    firstName: '',
    lastName: '',
    username: '',
  },
  isAdmin: false,
}

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<UserType>(initialState)

  return (
    <UserContext.Provider value={{ state, setState }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider }