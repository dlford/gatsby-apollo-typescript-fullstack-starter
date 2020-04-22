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
  </>
)

export default ReadMe
