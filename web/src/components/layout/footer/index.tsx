import React from 'react'
import tw from 'twin.macro'

const Div = tw.div`w-full mb-0 mt-auto`
const Footer = tw.footer`p-4 mt-8 bg-gray-500 text-gray-900 text-center shadow-inner font-montserrat text-xs`
const Span = tw.span`inline-block transform rotate-180 pb-px`

const FooterComponent = () => (
  <Div>
    <Footer>
      <p>
        Copyleft <Span>©</Span> DL Ford 2020
      </p>
    </Footer>
  </Div>
)

export default FooterComponent
