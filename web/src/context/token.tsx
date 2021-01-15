import React, { createContext, useState, useContext } from 'react'

// TODO : subscribe to sessionDeleted and drop token if deleted

export interface TokenConsumerProps {
  token: string | void
  setToken(arg0: string | void): void
}

export interface TokenProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const TokenContext = createContext<TokenConsumerProps>({
  token: undefined,
  setToken() {
    return
  },
})

export function TokenProvider({ children }: TokenProviderProps) {
  const [token, setToken] = useState<string | void>()

  return (
    <TokenContext.Provider
      value={{
        token,
        setToken,
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}

export default function useToken() {
  const { token, setToken } = useContext(TokenContext)

  return { token, setToken }
}
