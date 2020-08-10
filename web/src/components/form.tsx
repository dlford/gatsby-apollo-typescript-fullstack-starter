import tw from 'twin.macro'
import styled from '@emotion/styled'

const FormComponent = styled.form`
  ${tw`flex items-center flex-col mx-auto px-2`};
  label {
    ${tw`
      font-bold
      text-xs
      whitespace-no-wrap
      leading-tight
      m-2
      p-0
    `}
  }
  input {
    ${tw`
        w-64
        max-w-full
        shadow-md
        flex
        flex-no-wrap
        items-center
        justify-center
        bg-gray-200
        rounded
        p-2
        m-0
      `}
    flex: 1 1 100%;
  }
  button {
    ${tw`
      my-4
      shadow-lg
      cursor-pointer
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
      bg-blue-500
      hover:bg-blue-400
      active:bg-blue-600
      disabled:bg-gray-500
      text-white
    `}
  }
`

export default FormComponent
