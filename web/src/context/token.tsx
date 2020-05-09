import React, { createContext, useState } from 'react'

export interface TokenConsumerProps {
  token: string | void
  setToken(arg0: string | void): void
}

export const TokenContext = createContext<TokenConsumerProps>({
  token: undefined,
  setToken() {
    return
  },
})

export interface TokenProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const TokenProvider = ({ children }: TokenProviderProps) => {
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
