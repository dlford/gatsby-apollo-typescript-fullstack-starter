# Gatsby Apollo Typescript Full-Stack Starter

**This project is still in development!**

Current Status: Working, but lacks polish.

This starter includes a Node/Express/Apollo-Server backend and a
Gatsby/Apollo-Client frontend, upon completion it will provide
support for user sign-up and authentication, and subscriptions
(webhooks). All templated code will come with tests written
out of the box.

## Try it

You can simply run `npm install`, then `npm start` from the root of the project to get both the front-end and back-end up an running.

You do need an instance of MongoDB running on localhost:27017, if you have Docker installed you can do this by running:

```sh
docker run -d -p 27017:27017 --name mongo mongo:4.2
```

## Organization

- api
  - src
    - models: Mongoose Data Models
    - resolvers: GraphQL Resolvers
    - scalars: GraphQL Scalar Types
    - schema: GraphQL Schema
    - subscription: PubSub Subscription Definitions
    - app: Entrypoint for back-end
    - cronjobs: Scheduled tasks using `node-cron`
- web
  - src
    - app: Pages behind the login private routes (these can be put anywhere, but I like to keep them separate from `components`)
    - context
      - token: Provides a user's API access token if it exists
      - user: Provides user data and methods
    - hooks
      - use-session-data: Provides subscribed session data (data updates on page when changed via websocket)
    - lib
      - apollo-client: Sets up Apollo client for use with standard communications, websockets, and uploads
      - wrap-root-element: Wraps the Gatsby root element with context providers and Apollo client provider
      - wrap-ssr-element: Same as `wrap-root-element`, but for Gatsby SSR
    - pages: These routes are open without authentication
      - app: Router for pages behind authentication, returns authentication page if user is not authenticated

## Authentication Methodology

1. A user logs in or signs up
   1. The API returns an access token that is valid for 15 minutes, this is stored in memory only (token context)
   2. The API sends back two HTTP only cookies, one for the session, and another for the session ID, these expire in 30 days
   3. The API stores this session in the database (for future validation, and de-authorizing sessions by user)
2. The front-end (user's browser) starts a timer to request a new access token before the current one expires
3. The timer runs out, or page is refreshed, or visited at a later date
   1. A new access token is requested by the browser
      1. The API validates the session token by looking up the session ID
      2. If valid, the API returns a new access token and refreshes the session cookies and database entry
      3. If not valid, the API deletes the session cookies and database entry, the user is shown the login page

Note: The access token is stored in its own context, because Apollo Client needs the token at setup to pass it along with requests, and the user context needs access to Apollo Client in order to authenticate the user. Therefore, the user context is wrapped in Apollo client, which is wrapped in the token provider.
