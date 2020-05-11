import React from 'react'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  width: 100vw;
`

const AbstractHeaderComponent = () => {
  return (
    <Wrapper>
      <svg viewBox='0 0 338.415 33.528'>
        <path
          d='M110.306 9.7l58.052 15.042 96.138-17.05L232.547.009 150.085 0z'
          fill='#00aad4'
        />
        <path
          d='M338.415.009l-.004 33.52L232.547.01z'
          fill='#2c89a0'
        />
        <path
          d='M73.062 24.734L150.085 0l-88.09.018-33.259 10.748c14.13 4.73 29.393 9.305 44.326 13.968z'
          fill='#1fc3f1'
        />
        <path d='M.016.01L0 31.25 61.996.022z' fill='#5fbcd3' />
      </svg>
    </Wrapper>
  )
}

export default AbstractHeaderComponent
