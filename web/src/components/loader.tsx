import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'

export default function LoaderComponent() {
  const [showLoader, handleShowLoader] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => {
      handleShowLoader(true)
    }, 150)
    return () => {
      clearTimeout(startTimer)
    }
  }, [])

  return (
    <Main>
      {showLoader ? (
        <span className='wrapper'>
          <div className='target' />
        </span>
      ) : null}
    </Main>
  )
}

const Main = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .wrapper {
    animation: zoom 0.5s;
  }

  .target {
    padding: 0.75rem;
    box-sizing: border-box;
    border: 0.25rem solid #a0aec0;
    border-top: 0.25rem solid #e2e8f0;
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    animation-delay: 0s, 0.1s;
    animation: spin 750ms linear infinite;
  }

  @keyframes zoom {
    0% {
      transform: scale(0.1, 0.1);
    }
    100% {
      transform: scale(1, 1);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
