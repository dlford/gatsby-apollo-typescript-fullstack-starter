import tw from 'twin.macro'
import styled from '@emotion/styled'

const ArticleComponent = styled.article`
  ${tw`max-w-3xl mx-auto px-2`};
  h1,
  h2 {
    ${tw`font-montserrat font-black text-gray-900`};
  }
  h1 {
    ${tw`text-4xl`};
  }
  h2 {
    ${tw`text-2xl`};
  }
  ul {
    ${tw`list-disc list-inside`};
  }
  ol {
    ${tw`list-decimal list-inside`};
  }
  code {
    ${tw`bg-gray-300`};
  }
  a {
    ${tw`text-indigo-600 underline hover:text-indigo-800 hover:no-underline`};
  }
`

export default ArticleComponent
