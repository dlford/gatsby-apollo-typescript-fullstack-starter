import tw from 'twin.macro'
import styled from '@emotion/styled'

const FormComponent = styled.form`
  ${tw`flex items-center flex-col mx-auto px-2`};
  button {
    ${tw`my-4`}
  }
  input {
    ${tw`w-48 max-w-full`}
  }
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
        flex
        flex-no-wrap
        items-center
        justify-center
        bg-gray-300
        rounded
        p-2
        m-0
      `}
    flex: 1 1 100%;
  }
  button {
    ${tw`
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
      disabled:bg-blue-200
      text-white
    `}
  }
`

export default FormComponent
