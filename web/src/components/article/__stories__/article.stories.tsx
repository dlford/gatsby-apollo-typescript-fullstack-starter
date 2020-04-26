import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs, text } from '@storybook/addon-knobs'

import Article from '../'

const defaultProps = `
  <h1>
    Gatsby Starter Typescript Kitchen Sink
  </h1>
  <p>
    Hey! You&apos;ve found my
    Gatsby Starter Typescript Kitchen Sink, I
    hope you do something cool with it!
  </p>
  <h2>Features</h2>
  <ul>
    <li>Don&apos;t use <code>React.FC</code> (See why
      <a
        href='https://github.com/facebook/create-react-app/pull/8177'
        target='_blank'
        rel='noopener noreferrer'
      >
        here
      </a>
    )</li>
    <li>Storybook</li>
    <li>Jest</li>
    <li>Prettier / ESLint</li>
    <li>Emotion</li>
    <li>Tailwind + Twin.Macro</li>
  </ul>
`

storiesOf('Elements', module)
  .addDecorator(withKnobs({ timestamps: true, escapeHTML: false }))
  .add('Article', () => (
    <Article>
      <div
        dangerouslySetInnerHTML={{
          __html: text('Children', defaultProps),
        }}
      />
    </Article>
  ))
