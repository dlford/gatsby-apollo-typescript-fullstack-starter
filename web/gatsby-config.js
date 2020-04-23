module.exports = {
  pathPrefix: `/gatsby-typescript-starter-minimalist`,
  siteMetadata: {
    title: `Gatsby Typescript Starter Minimalist`,
    description: `A minimalist Gatsby Typescript starter`,
    author: `DL Ford`,
    navItems: [
      {
        title: `Home`,
        url: `/`,
        isRelative: true,
      },
      {
        title: `Style Builder`,
        url: `/style-builder`,
        isRelative: true,
      },
    ],
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Gatsby Typescript Starter`,
        /* eslint-disable @typescript-eslint/camelcase */
        short_name: `Gatsby`,
        start_url: `/`,
        background_color: `#000`,
        theme_color: `#000`,
        /* eslint-enable @typescript-eslint/camelcase */
        display: `minimal-ui`,
        icon: `src/images/logo.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
