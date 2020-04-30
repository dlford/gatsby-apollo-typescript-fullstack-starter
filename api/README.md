# Apollo / GraphQL API

## Environment Variables

| Variable       | Description                                                                        | Default                                  |
|----------------|------------------------------------------------------------------------------------|------------------------------------------|
| NODE_ENV       | Use `production` or `development`, the GraphQL Explorer is disabled in production. | development                              |
| SECRET         | The JWT signing secret, use a random string.                                       | secret-stub                              |
| PORT           | The port to serve GraphQL on.                                                      | 3000                                     |
| DATABASE_URL   | The URL to a MongoDB instance, *Don't use the production DB when running tests!*   | mongodb://localhost:27017/development    |

## NPM Scripts

+ `doc` - generate this documentation in the `./doc` directory
+ `clean` - remove coverage data, Jest cache and transpiled files
+ `build` - transpile TypeScript to ES6
+ `build:watch` - interactive watch mode to automatically transpile source files
+ `lint` - lint source files and tests
+ `test` - run tests
+ `test:watch` - interactive watch mode to automatically re-run tests
+ `test:coverage` - generate test coverage report

