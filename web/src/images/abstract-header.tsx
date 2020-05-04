import React from 'react'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  width: 100vw;
`

const AbstractHeaderComponent = () => {
  return (
    <Wrapper>
      <svg viewBox='0 0 337.344 179.518'>
        <defs>
          <clipPath clipPathUnits='userSpaceOnUse' id='prefix__h'>
            <path
              fill='#ececec'
              strokeWidth={1.058}
              strokeLinecap='round'
              d='M.15 85.467h338.395v180.211H.15z'
            />
          </clipPath>
          <clipPath clipPathUnits='userSpaceOnUse' id='prefix__f'>
            <path
              fill='#ececec'
              strokeWidth={1.058}
              strokeLinecap='round'
              d='M.15 85.467h338.395v180.211H.15z'
            />
          </clipPath>
          <clipPath clipPathUnits='userSpaceOnUse' id='prefix__d'>
            <path
              fill='#ececec'
              strokeWidth={1.058}
              strokeLinecap='round'
              d='M.15 85.467h338.395v180.211H.15z'
            />
          </clipPath>
          <clipPath clipPathUnits='userSpaceOnUse' id='prefix__b'>
            <path
              fill='#ececec'
              strokeWidth={1.058}
              strokeLinecap='round'
              d='M.15 85.467h338.395v180.211H.15z'
            />
          </clipPath>
          <clipPath clipPathUnits='userSpaceOnUse' id='prefix__a'>
            <rect
              width={337.344}
              height={190.566}
              x={0.893}
              y={86.16}
              ry={5.325}
              rx={0.066}
              fill='#ececec'
              strokeWidth={1.058}
              strokeLinecap='round'
            />
          </clipPath>
          <filter id='prefix__c' colorInterpolationFilters='sRGB'>
            <feFlood
              floodOpacity={1}
              floodColor='#38397D'
              result='flood'
            />
            <feComposite
              in='flood'
              in2='SourceGraphic'
              operator='in'
              result='composite1'
            />
            <feGaussianBlur
              in='composite1'
              stdDeviation={1}
              result='blur'
            />
            <feOffset dx={1} dy={1} result='offset' />
            <feComposite
              in='SourceGraphic'
              in2='offset'
              result='composite2'
            />
          </filter>
          <filter id='prefix__g' colorInterpolationFilters='sRGB'>
            <feFlood
              floodOpacity={1}
              floodColor='#38397D'
              result='flood'
            />
            <feComposite
              in='flood'
              in2='SourceGraphic'
              operator='in'
              result='composite1'
            />
            <feGaussianBlur
              in='composite1'
              stdDeviation={1}
              result='blur'
            />
            <feOffset dx={1} dy={1} result='offset' />
            <feComposite
              in='SourceGraphic'
              in2='offset'
              result='composite2'
            />
          </filter>
          <filter id='prefix__i' colorInterpolationFilters='sRGB'>
            <feFlood
              floodOpacity={1}
              floodColor='#38397D'
              result='flood'
            />
            <feComposite
              in='flood'
              in2='SourceGraphic'
              operator='in'
              result='composite1'
            />
            <feGaussianBlur
              in='composite1'
              stdDeviation={1}
              result='blur'
            />
            <feOffset dx={1} dy={1} result='offset' />
            <feComposite
              in='SourceGraphic'
              in2='offset'
              result='composite2'
            />
          </filter>
          <filter id='prefix__e' colorInterpolationFilters='sRGB'>
            <feFlood
              floodOpacity={1}
              floodColor='#38397D'
              result='flood'
            />
            <feComposite
              in='flood'
              in2='SourceGraphic'
              operator='in'
              result='composite1'
            />
            <feGaussianBlur
              in='composite1'
              stdDeviation={1}
              result='blur'
            />
            <feOffset dx={-1} dy={1} result='offset' />
            <feComposite
              in='SourceGraphic'
              in2='offset'
              result='composite2'
            />
          </filter>
        </defs>
        <g
          transform='translate(-.893 -86.16)'
          clipPath='url(#prefix__a)'
        >
          <path
            clipPath='url(#prefix__b)'
            d='M110.44 154.007l58.052 106.367 96.138-120.562-31.949-54.337-82.462-.06z'
            fill='#00aad4'
            filter='url(#prefix__c)'
          />
          <path
            clipPath='url(#prefix__d)'
            d='M338.549 85.463l-.004 180.215L232.681 85.475z'
            fill='#2c89a0'
            filter='url(#prefix__e)'
          />
          <path
            clipPath='url(#prefix__f)'
            d='M73.196 218.399l77.023-132.983-88.09.094L28.87 143.3c14.13 25.427 29.393 50.027 44.326 75.098z'
            fill='#5fbcd3'
            filter='url(#prefix__g)'
          />
          <path
            clipPath='url(#prefix__h)'
            d='M.15 85.467L.134 193.153 62.13 85.51z'
            fill='#afdde9'
            filter='url(#prefix__i)'
          />
        </g>
      </svg>
    </Wrapper>
  )
}

export default AbstractHeaderComponent
