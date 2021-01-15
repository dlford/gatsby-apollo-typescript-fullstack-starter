import React, { MouseEvent } from 'react'
import tw from 'twin.macro'

export interface ButtonProps {
  primary?: boolean
  children: string
  onClick?(arg0: MouseEvent | void): void
}

export default function ButtonComponent({
  primary,
  children,
  onClick,
}: ButtonProps) {
  return primary ? (
    <PrimaryButtonStyles
      onClick={onClick}
      tabIndex={0}
      role='button'
      onKeyDown={(event) => {
        if (typeof onClick === 'function' && event.key === 'Enter')
          onClick()
      }}
    >
      {children}
    </PrimaryButtonStyles>
  ) : (
    <ButtonStyles
      onClick={onClick}
      tabIndex={0}
      role='button'
      onKeyDown={(event) => {
        if (typeof onClick === 'function' && event.key === 'Enter')
          onClick()
      }}
    >
      {children}
    </ButtonStyles>
  )
}

const ButtonStyles = tw.div`
  inline-block
  px-5
  py-3
  text-sm
  font-semibold
  tracking-wider
  text-gray-900
  uppercase
  bg-gray-400
  rounded-lg
  shadow-lg
  cursor-pointer
  focus:outline-none
  focus:shadow-outline
  hover:bg-gray-300
  active:bg-gray-500
`

const PrimaryButtonStyles = tw.div`
  inline-block
  px-5
  py-3
  text-sm
  font-semibold
  tracking-wider
  text-white
  uppercase
  bg-blue-500
  rounded-lg
  shadow-lg
  cursor-pointer
  focus:outline-none
  focus:shadow-outline
  hover:bg-blue-400
  active:bg-blue-600
`
