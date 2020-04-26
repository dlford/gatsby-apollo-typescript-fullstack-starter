export default {
  ...jest.requireActual('gatsby'),
  graphql: jest.fn(),
  useStaticQuery: jest.fn(() => ({
    data: {
      site: {
        siteMetadata: {
          title: 'Gatsby Typescript Starter Kitchen Sink',
        },
      },
    },
  })),
}
