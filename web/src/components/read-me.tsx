import React from 'react'
import tw from 'twin.macro'

export interface ReadMeProps {
  title: string
}

const Wrapper = tw.div`max-w-3xl mx-auto px-2`
const H1 = tw.h1`font-montserrat font-black text-gray-900 text-4xl`
const H2 = tw.h2`font-montserrat font-black text-gray-900 text-2xl`
const Ul = tw.ul`list-disc list-inside`
const Ol = tw.ol`list-decimal list-inside`
const Code = tw.code`bg-gray-300`
const A = tw.a`text-indigo-600 underline hover:text-indigo-800 hover:no-underline`

const ReadMeComponent = ({ title }: ReadMeProps) => (
  <Wrapper>
    <H1>Read Me</H1>
    <p>
      Hey! You&apos;ve found my {title}, I hope you do something cool
      with it!
    </p>
    <H2>Features</H2>
    <Ul>
      <li>
        Don&apos;t use <Code>React.FC</Code> (See why{' '}
        <A
          href='https://github.com/facebook/create-react-app/pull/8177'
          target='_blank'
          rel='noopener noreferrer'
        >
          here
        </A>
        )
      </li>
      <li>Minimal Fluff</li>
      <li>Prettier / ESLint</li>
      <li>Emotion + Tailwind + Twin.Macro</li>
    </Ul>
    <H2>Getting Started</H2>
    <Ol>
      <li>
        Initialize the project:{' '}
        <Code>
          npx gatsby new gatsby-typescript-starter
          https://github.com/dlford/gatsby-typescript-starter-kitchen-sink.git
        </Code>
      </li>
      <li>
        Change the fonts by installing new ones and importing them
        into <Code>gatsby-browser.js</Code>
      </li>
      <li>
        Change the font and theme color variables in the{' '}
        <Code>body</Code> section of <Code>styles/layout.css</Code>
      </li>
      <li>
        Customize or completely replace the css in the{' '}
        <Code>styles/</Code> directory (this is what the Style Builder
        page is for)
      </li>
    </Ol>
  </Wrapper>
)

export default ReadMeComponent
