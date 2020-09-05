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
