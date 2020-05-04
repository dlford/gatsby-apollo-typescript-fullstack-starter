import React, { MouseEvent } from 'react'
import tw from 'twin.macro'
import styled from '@emotion/styled'

export interface ButtonProps {
  primary?: boolean
  children: string
  onClick(arg0: MouseEvent | void): void
}

interface StyleProps {
  primary?: boolean
}

const Styles = styled('div')<StyleProps>(
  tw`
    cursor-pointer
    shadow-lg
    inline-block
    text-sm
    px-5
    py-3
    rounded-lg
    uppercase
    tracking-wider
    font-semibold
    focus:outline-none
    focus:shadow-outline
  `,
  ({ primary }) =>
    primary
      ? tw`
        bg-blue-500
        hover:bg-blue-400
        active:bg-blue-600
        text-white
      `
      : tw`
        bg-gray-400
        hover:bg-gray-300
        active:bg-gray-500
        text-gray-900
      `,
)

const Button = ({ primary, children, onClick }: ButtonProps) => (
  <Styles onClick={onClick} primary={primary}>
    {children}
  </Styles>
)

export default Button
