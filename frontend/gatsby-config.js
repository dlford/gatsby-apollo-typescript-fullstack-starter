module.exports = {
  siteMetadata: {
    title: `Gatsby Apollo Typescript Starter`,
    description: `Front-end for Gatsby Apollo Typescript Starter`,
    author: `@dlford`,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-transformer-typescript-css-modules`,
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
        name: `Gatsby Apollo Typescript Starter`,
        /* eslint-disable @typescript-eslint/camelcase */
        short_name: `Gatsby`,
        start_url: `/`,
        background_color: `#000`,
        theme_color: `#000`,
        /* eslint-enable @typescript-eslint/camelcase */
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
