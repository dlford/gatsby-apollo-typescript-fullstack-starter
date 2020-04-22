import React from 'react'

export interface ReadMeProps {
  title: string
}

const ReadMe: React.FC<ReadMeProps> = ({ title }) => (
  <>
    <h1>Read Me</h1>
    <p>
      Hey! You&apos;ve found my {title}, I hope you do something cool
      with it!
    </p>
    <h2>Features</h2>
    <ul>
      <li>Minimal Fluff</li>
      <li>Prettier / ESLint</li>
      <li>CSS Reset / CSS Modules</li>
      <li>Style Builder Page</li>
    </ul>
    <h2>Getting Started</h2>
    <ol>
      <li>
        Initialize the project:{' '}
        <code>
          npx gatsby new gatsby-typescript-starter
          https://github.com/dlford/gatsby-typescript-starter-minimalist.git
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
        <code>styles/</code> directory (this is what the Style Builder
        page is for)
      </li>
    </ol>
  </>
)

export default ReadMe
