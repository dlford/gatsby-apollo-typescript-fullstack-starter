import React from 'react'

import Article from '~/components/article'

export interface ReadMeProps {
  title: string
}

const ReadMeComponent = ({ title }: ReadMeProps) => (
  <Article>
    <div>
      <h1>Read Me</h1>
      <p>
        Hey! You&apos;ve found my {title}, I hope you do something
        cool with it!
      </p>
      <h2>Features</h2>
      <ul>
        <li>
          Don&apos;t use <code>React.FC</code> (See why{' '}
          <a
            href='https://github.com/facebook/create-react-app/pull/8177'
            target='_blank'
            rel='noopener noreferrer'
          >
            here
          </a>
          )
        </li>
        <li>Minimal Fluff</li>
        <li>Prettier / ESLint</li>
        <li>Emotion + Tailwind + Twin.Macro</li>
      </ul>
      <h2>Getting Started</h2>
      <ol>
        <li>
          Initialize the project:{' '}
          <code>
            npx gatsby new gatsby-typescript-starter
            https://github.com/dlford/gatsby-typescript-starter-kitchen-sink.git
          </code>
        </li>
        <li>
          Change the fonts by installing new ones and importing them
          into <code>gatsby-browser.js</code>
        </li>
        <li>
          Change the font and theme color variables in the{' '}
          <code>body</code> section of <code>styles/layout.css</code>
        </li>
        <li>
          Customize or completely replace the css in the{' '}
          <code>styles/</code> directory (this is what the Style
          Builder page is for)
        </li>
      </ol>
    </div>
  </Article>
)

export default ReadMeComponent
