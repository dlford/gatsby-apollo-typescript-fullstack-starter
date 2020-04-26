import * as Gatsby from 'gatsby'
import React from 'react'
import renderer from 'react-test-renderer'
import Header from '.'

const useStaticQuery = jest.spyOn(Gatsby, 'useStaticQuery')
useStaticQuery.mockImplementation(() => ({
  site: {
    siteMetadata: {
      title: 'Gatsby Typescript Starter Kitchen Sink',
    },
  },
}))

describe('Header', () => {
  it('renders correctly', () => {
    let tree = renderer
      .create(<Header shouldShowBigHeader={true} />)
      .toJSON()
    expect(tree).toMatchInlineSnapshot(`
      <header
        className="css-qvblc6"
      >
        <div
          className="css-1lo4jn8"
        >
          <svg
            viewBox="0 0 135.467 135.467"
          >
            <defs
              id="prefix__defs2"
            >
              <linearGradient
                id="prefix__linearGradient2393"
              >
                <stop
                  id="prefix__stop2391"
                  offset={0}
                  stopColor="#f60"
                  stopOpacity={1}
                />
              </linearGradient>
            </defs>
            <g
              id="prefix__layer1"
              transform="translate(30.89 -192.422)"
            >
              <circle
                cx={45.689}
                cy={249.113}
                fill="#fff"
                fillOpacity={1}
                fillRule="nonzero"
                id="prefix__path2444"
                r={56.772}
                stroke="none"
                strokeWidth={0.222}
              />
              <path
                d="M45.689 194.559c-30.132 0-54.555 24.423-54.555 54.554 0 30.132 24.423 54.555 54.555 54.555 30.131 0 54.554-24.423 54.554-54.555 0-30.131-24.423-54.554-54.554-54.554zM2.857 249.68l42.264 42.264c-23.21-.301-41.963-19.055-42.264-42.264zm52.42 41.195l-51.35-51.351c4.355-19.042 21.398-33.252 41.762-33.252 14.232 0 26.845 6.943 34.635 17.627l-5.93 5.233c-6.32-9.06-16.821-14.991-28.705-14.991-15.131 0-28.02 9.61-32.89 23.06L57.599 282c10.88-3.941 19.247-13.124 22.049-24.498H61.082v-8.388h27.452c-.005 20.364-14.215 37.407-33.257 41.763z"
                fill="#744c9e"
                id="prefix__path815"
                strokeWidth={0.044}
              />
              <path
                d="M-26.274 271.1v5.319h16.967v48.29h12.04v-48.29H19.7v-5.22c0-2.937 0-5.32-.13-5.384 0-.098-10.344-.13-22.906-.13l-22.84.097v5.351zm76.254-5.448c3.328.783 5.873 2.284 8.157 4.665 1.207 1.306 3.002 3.59 3.132 4.177 0 .196-5.645 4.013-9.07 6.134-.131.098-.653-.457-1.175-1.305-1.697-2.415-3.426-3.459-6.135-3.654-3.915-.262-6.525 1.794-6.525 5.22 0 1.044.195 1.632.587 2.48.881 1.794 2.512 2.871 7.57 5.09 9.332 4.013 13.378 6.656 15.825 10.441 2.773 4.242 3.393 10.898 1.533 15.89-2.088 5.45-7.178 9.136-14.454 10.344-2.284.391-7.505.326-9.952-.098-5.22-.98-10.213-3.59-13.28-6.95-1.207-1.305-3.524-4.797-3.393-5.025l1.24-.783 4.894-2.839 3.687-2.153.848 1.142c1.077 1.696 3.492 3.98 4.895 4.763 4.241 2.187 9.919 1.893 12.725-.652 1.207-1.11 1.73-2.284 1.73-3.916 0-1.5-.23-2.186-.98-3.328-1.044-1.435-3.132-2.61-9.005-5.22-6.754-2.872-9.626-4.699-12.301-7.505-1.534-1.697-2.937-4.34-3.59-6.526-.489-1.892-.652-6.525-.195-8.385 1.403-6.526 6.33-11.094 13.378-12.399 2.284-.457 7.667-.261 9.919.326z"
                fill="#007acc"
                fillOpacity={1}
                id="prefix__path2462"
                stroke="#fff"
                strokeDasharray="none"
                strokeMiterlimit={4}
                strokeOpacity={1}
                strokeWidth={1}
              />
            </g>
            <style
              id="style842"
            />
            <style
              id="style2458"
            />
          </svg>
        </div>
        <h1
          className="css-f0rg1u"
        >
          Gatsby Typescript Starter Kitchen Sink
        </h1>
      </header>
    `)
    tree = renderer
      .create(<Header shouldShowBigHeader={false} />)
      .toJSON()
    expect(tree).toMatchInlineSnapshot(`
      <header
        className="css-qvblc6"
      >
        <h1
          className="css-f0rg1u"
        >
          Gatsby Typescript Starter Kitchen Sink
        </h1>
      </header>
    `)
  })
})
