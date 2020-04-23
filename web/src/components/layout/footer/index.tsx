import React from 'react'
import tw from 'twin.macro'

const Div = tw.div`w-full mb-0`
const Footer = tw.footer`p-4 mt-8 bg-orange-400 text-center shadow-inner`
const Span = tw.span`inline-block scale-x-invert`

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
