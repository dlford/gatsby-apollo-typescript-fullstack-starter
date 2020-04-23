import React from 'react'

import Layout from '~/components/layout'

export interface StyleBuilderProps {
  location: Location
}

const StyleBuilder = ({ location }: StyleBuilderProps) => (
  <Layout location={location}>
    <section>
      <article>
        <h1>Article</h1>
        <h1>Heading 1</h1>
        <p>
          <strong>This text is bold</strong> senectus et netus et
          malesuada fames ac turpis <sub>sub</sub> egestas
          <sup>sup</sup>. Vestibulum tortor quam, feugiat vitae,
          ultricies eget, tempor sit amet, ante. Donec eu libero sit
          amet quam egestas semper. <em>this text is italic.</em>{' '}
          Mauris placerat eleifend leo. Quisque sit{' '}
          <ins>this text is inserted</ins> est et sapien ullamcorper
          pharetra.{' '}
          <strong>
            <em>this text is bold italic</em>
          </strong>{' '}
          erat wisi, condimentum sed,{' '}
          <code>
            {' '}
            This is a Really Really Really Really Really Long Inline
            Code Block
          </code>{' '}
          , ornare sit amet, wisi. Aenean fermentum, elit eget
          tincidunt condimentum, eros ipsum rutrum orci,{' '}
          <mark> this text is marked</mark> tempus lacus enim ac dui.{' '}
          <a href='/#'>this is a link</a> in turpis pulvinar
          facilisis. Ut felis.{' '}
        </p>
        <h2>Heading 2 (Small p)</h2>
        <p>
          <small>
            Pellentesque habitant morbi tristique senectus et netus et
            malesuada fames ac turpis egestas. Vestibulum tortor quam,
            feugiat vitae, ultricies eget, tempor sit amet, ante.
            Donec eu libero sit amet quam egestas semper. Aenean
            ultricies mi vitae est. Mauris placerat eleifend leo.{' '}
          </small>
        </p>
        <h3>Heading 3</h3>
        <p>
          {' '}
          Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, ante. Donec
          eu libero sit amet quam egestas semper. Aenean ultricies mi
          vitae est. Mauris placerat eleifend leo.{' '}
        </p>
        <h4>Heading 4</h4>
        <p>
          {' '}
          Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, ante. Donec
          eu libero sit amet quam egestas semper. Aenean ultricies mi
          vitae est. Mauris placerat eleifend leo.{' '}
        </p>
        <h5>Heading 5</h5>
        <p>
          {' '}
          Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, ante. Donec
          eu libero sit amet quam egestas semper. Aenean ultricies mi
          vitae est. Mauris placerat eleifend leo.{' '}
        </p>
        <h6>Heading 6</h6>
        <p>
          {' '}
          Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, ante. Donec
          eu libero sit amet quam egestas semper. Aenean ultricies mi
          vitae est. Mauris placerat eleifend leo.{' '}
        </p>
      </article>
    </section>
    <hr />
    <section>
      <h1>Heading 1</h1>
      <p>
        <strong>This text is bold</strong> senectus et netus et
        malesuada fames ac turpis <sub>sub</sub> egestas<sup>sup</sup>
        . Vestibulum tortor quam, feugiat vitae, ultricies eget,
        tempor sit amet, ante. Donec eu libero sit amet quam egestas
        semper. <em>this text is italic.</em> Mauris placerat eleifend
        leo. Quisque sit <ins>this text is inserted</ins> est et
        sapien ullamcorper pharetra.{' '}
        <strong>
          <em>this text is bold italic</em>
        </strong>{' '}
        erat wisi, condimentum sed,{' '}
        <code>
          {' '}
          This is a Really Really Really Really Really Long Inline
          Code Block
        </code>{' '}
        , ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt
        condimentum, eros ipsum rutrum orci,{' '}
        <mark> this text is marked</mark> tempus lacus enim ac dui.{' '}
        <a href='/#'>this is a link</a> in turpis pulvinar facilisis.
        Ut felis.{' '}
      </p>
      <h2>Heading 2 (Small p)</h2>
      <p>
        <small>
          Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, ante. Donec
          eu libero sit amet quam egestas semper. Aenean ultricies mi
          vitae est. Mauris placerat eleifend leo.{' '}
        </small>
      </p>
      <h3>Heading 3</h3>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <h4>Heading 4</h4>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <h5>Heading 5</h5>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <h6>Heading 6</h6>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
    </section>
    <hr />
    <h1>Long Headings</h1>
    <section>
      <h1>
        {' '}
        This is a Really Really Really Really Really Long Header of
        the Size 1{' '}
      </h1>
      <p>
        <strong>This text is bold</strong> senectus et netus et
        malesuada fames ac turpis <sub>sub</sub> egestas<sup>sup</sup>
        . Vestibulum tortor quam, feugiat vitae, ultricies eget,
        tempor sit amet, ante. Donec eu libero sit amet quam egestas
        semper. <em>this text is italic.</em> Mauris placerat eleifend
        leo. Quisque sit <ins>this text is inserted</ins> est et
        sapien ullamcorper pharetra.{' '}
        <strong>
          <em>this text is bold italic</em>
        </strong>{' '}
        erat wisi, condimentum sed,{' '}
        <code>
          {' '}
          This is a Really Really Really Really Really Long Inline
          Code Block
        </code>{' '}
        , ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt
        condimentum, eros ipsum rutrum orci,{' '}
        <mark>this text is marked</mark> tempus lacus enim ac dui.{' '}
        <a href='/#'>this is a link</a> in turpis pulvinar facilisis.
        Ut felis.{' '}
      </p>
      <h2>
        {' '}
        This is a Really Really Really Really Really Long Header of
        the Size 2{' '}
      </h2>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <h3>
        {' '}
        This is a Really Really Really Really Really Long Header of
        the Size 3{' '}
      </h3>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <h4>
        {' '}
        This is a Really Really Really Really Really Long Header of
        the Size 4{' '}
      </h4>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <h5>
        {' '}
        This is a Really Really Really Really Really Long Header of
        the Size 5{' '}
      </h5>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <h6>
        {' '}
        This is a Really Really Really Really Really Long Header of
        the Size 6{' '}
      </h6>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
    </section>
    <hr />
    <section>
      <h1>Table</h1>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <table>
        <thead>
          <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jill</td>
            <td>Smith</td>
            <td>50</td>
          </tr>
          <tr>
            <td>Eve</td>
            <td>Jackson</td>
            <td>94</td>
          </tr>
        </tbody>
      </table>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
    </section>
    <hr />
    <section>
      <h1>BlockQuote</h1>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <blockquote>
        <p>
          {' '}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Vivamus magna. Cras in mi at felis aliquet congue. Ut a est
          eget ligula molestie gravida. Curabitur massa. Donec
          eleifend, libero at sagittis mollis, tellus est malesuada
          tellus, at luctus turpis elit sit amet quam. Vivamus pretium
          ornare est.{' '}
        </p>
      </blockquote>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
    </section>
    <hr />
    <section>
      <h1>Code Block</h1>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <pre>
        <code className='language-js'>
          {`import React, { useState, createRef, useEffect } from "react"
import styled from "styled-components"
import { useInView } from "react-intersection-observer"

const SvgComponent = props => {
const [inViewRef, inView] = useInView({
  triggerOnce: true,
})
const pathRef = createRef()
const [pathLength, setPathLength] = useState()

useEffect(() => {
  if (pathRef.current) {
    setPathLength(pathRef.current.getTotalLength())
  }
}, [pathRef])

return (
  <Wrapper ref={inViewRef} pathLength={pathLength}>
    <svg
      className={inView ? "animated visible" : "animated"}
      viewBox="0 0 127.237 53.457"
      {...props}
    >
      <path
        ref={pathRef}
        d="M5.27 7.113l-1.7-4.158S3.475.593 4.23.215c.756-.378 3.78.567 4.158 3.118.378 2.552-.472 6.237-2.551 8.316-2.08 2.079-6.142.189-5.67-.567.472-.756 3.024-5.292 2.079-6.331C1.302 3.71.263 12.877.64 13.255c.378.378 5.009 1.323 6.426.284 1.417-1.04 0-1.323 1.323-1.323s3.969-1.89 4.158-5.386c.189-3.497 1.606.283 1.228 1.606-.378 1.323-.756 3.024.473 4.063 1.228 1.04 3.023-1.228 3.118-2.55.094-1.324 3.213-4.348 2.362-3.12-.85 1.23-2.646 3.12-2.362 4.725.283 1.607 2.646 1.134 2.835.19.189-.945 1.134-6.71 1.04-4.914-.095 1.795-.284 5.008.472 5.291.756.284 1.512.756 2.834-1.417 1.323-2.173 1.89-6.804 1.512-4.441-.378 2.362-1.7 5.291-.567 5.858 1.134.567 2.174-.283 2.646-2.362.473-2.079.945-7.181.662-3.874-.284 3.307-.756 5.953.472 6.33 1.229.379 1.701.095 1.701-1.794 0-1.89-.661-4.158.095-4.064.756.095 2.55.756 2.55.756"
        fill="none"
        stroke="#000"
        strokeWidth={0.265}
      />
    </svg>
  </Wrapper>
)
}

const Wrapper = styled.div\`
.animated {
  max-width: 300px;
  width: 100%;
  height: 100%;
  stroke-dasharray: \${props => props.pathLength};
  stroke-dashoffset: \${props => props.pathLength};
}
.animated.visible {
  animation: draw 6s linear forwards;
}
@keyframes draw {
  from {
    stroke-dashoffset: \${props => props.pathLength};
  }
  to {
    stroke-dashoffset: 0;
  }
}
\`

export default SvgComponent`}
        </code>
      </pre>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <h1>Ligatures?</h1>
      <pre>
        <code className='language-text'>
          {`.= ..= := =:= =!= __ == != === !== =/=
<-< <<- <-- <->
<=< <<= <== <=>
>>= >>- >- <~>
<~~ <~ ~~
<<< << <= <> >= >> >>>
{|[|<: :<
<|||<||<|<|>
<$ <$>
<+ <+>
<* <*>
/* */ /// //
</ <!-- </> --> />
0xFF 10x10
9:45 [:] m-x m+x *ptr
;; :: ::: .. ... ..<
!! ?? %% && || ?. ?:
+ ++ +++
- -- ---
* ** ***
~= ~~ www ~~ ~@
^= ?= /= ||=
-| _|_ |- |= ||=
#! #= #: ## ### ####
#{ #[ #( #_ #_(`}
        </code>
      </pre>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
    </section>
    <hr />
    <section>
      <h1>Ordered List</h1>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <ol>
        <li>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
        </li>
        <li>Aliquam tincidunt mauris eu risus.</li>
        <li>
          {' '}
          Vestibulum auctor dapibus neque.{' '}
          <ol>
            <li>
              Lorem ipsum dolor sit amet, consectetuer adipiscing
              elit.
            </li>
            <li>Aliquam tincidunt mauris eu risus.</li>
            <li>
              {' '}
              Vestibulum auctor dapibus neque.{' '}
              <ol>
                <li>
                  {' '}
                  Lorem ipsum dolor sit amet, consectetuer adipiscing
                  elit.{' '}
                </li>
                <li>Aliquam tincidunt mauris eu risus.</li>
                <li>
                  {' '}
                  Vestibulum auctor dapibus neque.{' '}
                  <ol>
                    <li>
                      {' '}
                      Lorem ipsum dolor sit amet, consectetuer
                      adipiscing elit.{' '}
                    </li>
                    <li>Aliquam tincidunt mauris eu risus.</li>
                    <li>
                      {' '}
                      Vestibulum auctor dapibus neque.{' '}
                      <ol>
                        <li>
                          {' '}
                          Lorem ipsum dolor sit amet, consectetuer
                          adipiscing elit.{' '}
                        </li>
                        <li>Aliquam tincidunt mauris eu risus.</li>
                        <li>Vestibulum auctor dapibus neque.</li>
                      </ol>
                    </li>
                  </ol>
                </li>
              </ol>
            </li>
          </ol>
        </li>
      </ol>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
    </section>
    <hr />
    <section>
      <h1>Un-ordered List</h1>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <ul>
        <li>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
        </li>
        <li>Aliquam tincidunt mauris eu risus.</li>
        <li>
          {' '}
          Vestibulum auctor dapibus neque.{' '}
          <ul>
            <li>
              Lorem ipsum dolor sit amet, consectetuer adipiscing
              elit.
            </li>
            <li>Aliquam tincidunt mauris eu risus.</li>
            <li>
              {' '}
              Vestibulum auctor dapibus neque.{' '}
              <ul>
                <li>
                  {' '}
                  Lorem ipsum dolor sit amet, consectetuer adipiscing
                  elit.{' '}
                </li>
                <li>Aliquam tincidunt mauris eu risus.</li>
                <li>
                  {' '}
                  Vestibulum auctor dapibus neque.{' '}
                  <ul>
                    <li>
                      {' '}
                      Lorem ipsum dolor sit amet, consectetuer
                      adipiscing elit.{' '}
                    </li>
                    <li>Aliquam tincidunt mauris eu risus.</li>
                    <li>
                      {' '}
                      Vestibulum auctor dapibus neque.{' '}
                      <ul>
                        <li>
                          {' '}
                          Lorem ipsum dolor sit amet, consectetuer
                          adipiscing elit.{' '}
                        </li>
                        <li>Aliquam tincidunt mauris eu risus.</li>
                        <li>
                          {' '}
                          Vestibulum auctor dapibus neque.{' '}
                          <ul>
                            <li>
                              {' '}
                              Lorem ipsum dolor sit amet, consectetuer
                              adipiscing elit.{' '}
                            </li>
                            <li>
                              Aliquam tincidunt mauris eu risus.
                            </li>
                            <li>Vestibulum auctor dapibus neque.</li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
      <p>
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.
      </p>
    </section>
    <hr />
    <section>
      <h1>Un-ordered List With Nested Paragraphs</h1>
      <p>
        {' '}
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.{' '}
      </p>
      <ul>
        <li>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
          <p>
            Pellentesque habitant morbi tristique senectus et netus et
            malesuada fames ac turpis egestas. Vestibulum tortor quam,
            feugiat vitae, ultricies eget, tempor sit amet, ante.
            Donec eu libero sit amet quam egestas semper. Aenean
            ultricies mi vitae est. Mauris placerat eleifend leo.
          </p>
        </li>
        <li>
          Aliquam tincidunt mauris eu risus.{' '}
          <p>
            Pellentesque habitant morbi tristique senectus et netus et
            malesuada fames ac turpis egestas. Vestibulum tortor quam,
            feugiat vitae, ultricies eget, tempor sit amet, ante.
            Donec eu libero sit amet quam egestas semper. Aenean
            ultricies mi vitae est. Mauris placerat eleifend leo.
          </p>
        </li>
        <li>
          {' '}
          Vestibulum auctor dapibus neque.{' '}
          <ul>
            <li>
              Lorem ipsum dolor sit amet, consectetuer adipiscing
              elit.{' '}
              <p>
                Pellentesque habitant morbi tristique senectus et
                netus et malesuada fames ac turpis egestas. Vestibulum
                tortor quam, feugiat vitae, ultricies eget, tempor sit
                amet, ante. Donec eu libero sit amet quam egestas
                semper. Aenean ultricies mi vitae est. Mauris placerat
                eleifend leo.
              </p>
            </li>
            <li>
              Aliquam tincidunt mauris eu risus.{' '}
              <p>
                Pellentesque habitant morbi tristique senectus et
                netus et malesuada fames ac turpis egestas. Vestibulum
                tortor quam, feugiat vitae, ultricies eget, tempor sit
                amet, ante. Donec eu libero sit amet quam egestas
                semper. Aenean ultricies mi vitae est. Mauris placerat
                eleifend leo.
              </p>
            </li>
            <li>
              {' '}
              Vestibulum auctor dapibus neque.{' '}
              <ul>
                <li>
                  {' '}
                  Lorem ipsum dolor sit amet, consectetuer adipiscing
                  elit.{' '}
                  <p>
                    Pellentesque habitant morbi tristique senectus et
                    netus et malesuada fames ac turpis egestas.
                    Vestibulum tortor quam, feugiat vitae, ultricies
                    eget, tempor sit amet, ante. Donec eu libero sit
                    amet quam egestas semper. Aenean ultricies mi
                    vitae est. Mauris placerat eleifend leo.
                  </p>
                </li>
                <li>
                  Aliquam tincidunt mauris eu risus.{' '}
                  <p>
                    Pellentesque habitant morbi tristique senectus et
                    netus et malesuada fames ac turpis egestas.
                    Vestibulum tortor quam, feugiat vitae, ultricies
                    eget, tempor sit amet, ante. Donec eu libero sit
                    amet quam egestas semper. Aenean ultricies mi
                    vitae est. Mauris placerat eleifend leo.
                  </p>
                </li>
                <li>
                  {' '}
                  Vestibulum auctor dapibus neque.{' '}
                  <ul>
                    <li>
                      {' '}
                      Lorem ipsum dolor sit amet, consectetuer
                      adipiscing elit.{' '}
                      <p>
                        Pellentesque habitant morbi tristique senectus
                        et netus et malesuada fames ac turpis egestas.
                        Vestibulum tortor quam, feugiat vitae,
                        ultricies eget, tempor sit amet, ante. Donec
                        eu libero sit amet quam egestas semper. Aenean
                        ultricies mi vitae est. Mauris placerat
                        eleifend leo.
                      </p>
                    </li>
                    <li>
                      Aliquam tincidunt mauris eu risus.{' '}
                      <p>
                        Pellentesque habitant morbi tristique senectus
                        et netus et malesuada fames ac turpis egestas.
                        Vestibulum tortor quam, feugiat vitae,
                        ultricies eget, tempor sit amet, ante. Donec
                        eu libero sit amet quam egestas semper. Aenean
                        ultricies mi vitae est. Mauris placerat
                        eleifend leo.
                      </p>
                    </li>
                    <li>
                      {' '}
                      Vestibulum auctor dapibus neque.{' '}
                      <ul>
                        <li>
                          {' '}
                          Lorem ipsum dolor sit amet, consectetuer
                          adipiscing elit.{' '}
                          <p>
                            Pellentesque habitant morbi tristique
                            senectus et netus et malesuada fames ac
                            turpis egestas. Vestibulum tortor quam,
                            feugiat vitae, ultricies eget, tempor sit
                            amet, ante. Donec eu libero sit amet quam
                            egestas semper. Aenean ultricies mi vitae
                            est. Mauris placerat eleifend leo.
                          </p>
                        </li>
                        <li>
                          Aliquam tincidunt mauris eu risus.{' '}
                          <p>
                            Pellentesque habitant morbi tristique
                            senectus et netus et malesuada fames ac
                            turpis egestas. Vestibulum tortor quam,
                            feugiat vitae, ultricies eget, tempor sit
                            amet, ante. Donec eu libero sit amet quam
                            egestas semper. Aenean ultricies mi vitae
                            est. Mauris placerat eleifend leo.
                          </p>
                        </li>
                        <li>
                          {' '}
                          Vestibulum auctor dapibus neque.{' '}
                          <ul>
                            <li>
                              {' '}
                              Lorem ipsum dolor sit amet, consectetuer
                              adipiscing elit.{' '}
                              <p>
                                Pellentesque habitant morbi tristique
                                senectus et netus et malesuada fames
                                ac turpis egestas. Vestibulum tortor
                                quam, feugiat vitae, ultricies eget,
                                tempor sit amet, ante. Donec eu libero
                                sit amet quam egestas semper. Aenean
                                ultricies mi vitae est. Mauris
                                placerat eleifend leo.
                              </p>
                            </li>
                            <li>
                              Aliquam tincidunt mauris eu risus.{' '}
                              <p>
                                Pellentesque habitant morbi tristique
                                senectus et netus et malesuada fames
                                ac turpis egestas. Vestibulum tortor
                                quam, feugiat vitae, ultricies eget,
                                tempor sit amet, ante. Donec eu libero
                                sit amet quam egestas semper. Aenean
                                ultricies mi vitae est. Mauris
                                placerat eleifend leo.
                              </p>
                            </li>
                            <li>
                              Vestibulum auctor dapibus neque.{' '}
                              <p>
                                Pellentesque habitant morbi tristique
                                senectus et netus et malesuada fames
                                ac turpis egestas. Vestibulum tortor
                                quam, feugiat vitae, ultricies eget,
                                tempor sit amet, ante. Donec eu libero
                                sit amet quam egestas semper. Aenean
                                ultricies mi vitae est. Mauris
                                placerat eleifend leo.
                              </p>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
      <p>
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.
      </p>
    </section>
    <hr />
    <section>
      <h1>Form</h1>
      <p>
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.
      </p>
      <form action='#' method='post'>
        <div>
          <label htmlFor='name'>Text Input:</label>
          <input
            type='text'
            name='name'
            id='name'
            defaultValue=''
            tabIndex='1'
          />
        </div>
        <div>
          <label htmlFor='email'>Email Input:</label>
          <input
            type='email'
            name='email'
            id='email'
            defaultValue=''
            tabIndex='1'
          />
        </div>
        <div>
          <label htmlFor='password'>password Input:</label>
          <input
            type='password'
            name='password'
            id='password'
            defaultValue=''
            tabIndex='1'
          />
        </div>
        <div>
          <label htmlFor='radio-choice-1'>Choice 1</label>
          <input
            type='radio'
            name='radio-choice-1'
            id='radio-choice-1'
            tabIndex='2'
            defaultValue='choice-1'
          />
        </div>
        <div>
          <label htmlFor='radio-choice-2'>Choice 2</label>
          <input
            type='radio'
            name='radio-choice-2'
            id='radio-choice-2'
            tabIndex={3}
            defaultValue='choice-2'
          />
        </div>
        <div>
          <label htmlFor='select-choice'>
            Select Dropdown Choice:
          </label>
          <select name='select-choice' id='select-choice'>
            <option defaultValue='Choice 1'>Choice 1</option>
            <option defaultValue='Choice 2'>Choice 2</option>
            <option defaultValue='Choice 3'>Choice 3</option>
          </select>
        </div>
        <div>
          <label htmlFor='checkbox'>Checkbox:</label>
          <input type='checkbox' name='checkbox' id='checkbox' />
        </div>
        <div>
          <button type='submit'>Submit</button>
        </div>
      </form>
      <p>
        Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam,
        feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
        libero sit amet quam egestas semper. Aenean ultricies mi vitae
        est. Mauris placerat eleifend leo.
      </p>
    </section>
  </Layout>
)

export default StyleBuilder
