<!--suppress HtmlDeprecatedAttribute -->
<img src="rpitv_glimpse_logo.png" width="125" alt="Logo of the project" align="right">

# Glimpse API &middot; <!-- [![Build Status](https://img.shields.io/travis/npm/npm/latest.svg?style=flat-square)](https://travis-ci.org/npm/npm) --> [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/your/your-project/blob/master/LICENSE)

This is the backend API for Glimpse, the RPI TV website. For more information about the project, including features,
check out the [project wiki](https://github.com/rpitv/glimpse-api/wiki).

View the project in action at https://rpi.tv/.

## Installing / Getting started

It's recommended to use Docker with Docker Compose for production deployments. To use the provided Docker Compose file,
Docker Compose must be version 1.28.0 or higher.

Start by cloning this repository.

```shell
git clone https://github.com/rpitv/glimpse-api.git
cd glimpse-api
```

Then create your `.env.docker` file. You can use the `.env.sample` file as a template, and then modify it to match your
environment.

```shell
cp .env.sample .env.docker
```

After that, you can start up the Docker containers.

```shell
docker compose --profile api-production up -d
```

This will pull the latest version of this repository's Docker image and start it up with the necessary dependencies.
You can then use Prisma and the CLI to bootstrap your database. This requires the current LTS version of Node.js and 
NPM.

```shell
npx prisma migrate deploy # Create the database schema
npm run cli # Start the CLI
```

<img src="cli-demo.gif" width="637" alt="Demo of the CLI">

Alternatively, you can bootstrap the database manually. Read more on the 
[Bootstrapping](https://github.com/rpitv/glimpse-api/wiki/Bootstrapping) article.

When you are done, it's highly recommended to modify your `docker-compose.yml` so that only the API service has its
port(s) exposed to the host machine. For more information or alternative options for deployment, check out the 
[Deployment](https://github.com/rpitv/glimpse-api/wiki/Deployment) article.

## Developing

### Built With

This project is built on [NestJS](https://nestjs.com/) and written in [TypeScript](http://typescriptlang.org/). 
Additional major dependencies include:

- [Prisma](https://www.prisma.sh/)
- [CASL](https://casl.js.org/v6/en/)
- [Passport](https://www.passportjs.org/)

The project also depends on the following services:

- PostgreSQL
- Redis
- RabbitMQ

### Prerequisites

To run the development environment for this project, you should have Node.js LTS installed, along with NPM. We
recommend using [NVM](https://github.com/nvm-sh/nvm) to manage your Node.js installation. If you are on Windows, you 
can use [NVM for Windows](https://github.com/coreybutler/nvm-windows).

While the API does not run in Docker for development, you should have Docker and Docker Compose installed for running
the other services which the API depends on. This project has been tested on Docker Engine version 20.10. Docker Compose
must be version 1.28.0 or higher.

Git must also be installed to clone the repository and manage your changes.

### Setting up Dev

Start by cloning the repository. We recommend using SSH for this, as it is more secure, but you can use HTTPS if you 
prefer or are not able to use SSH.

```shell
git clone git@github.com:rpitv/glimpse-api.git
cd glimpse-api/
npm i
```

After that, you will need to create your `.env` file. You can use the `.env.sample` file as a template, and then modify
it to match your environment.

```shell
cp .env.sample .env
```

Once you have your `.env` file, you will need to create a `.env.docker` file. Your `.env.docker` file should be the same
as your `.env` file, except any references to `localhost` need to be replaced with their corresponding Docker service
names. For example, if you have `RABBITMQ_URL= RABBITMQ_URL=amqp://localhost:5672`, you would change it to
`RABBITMQ_URL= RABBITMQ_URL=amqp://rabbitmq:5672`.

Now you can start up the Docker containers which the API depends on.

```shell
docker compose up -d
```

Once the database is up and running, you can use Prisma and the CLI to bootstrap your database.

```shell
npx prisma migrate deploy # Create the database schema
npm run cli # Start the CLI
```

<img src="cli-demo.gif" width="637" alt="Demo of the CLI">

Once your database is initialized, you can start the API.

```shell
npm run start:dev
```

The API will be available at http://localhost:4000. A GraphQL playground will be available at 
http://localhost:4000/graphql.

### Building

In order to build the project, you will need to complete all of the above steps in the [Setting up Dev](#setting-up-dev)
section. The project can then be built using the build command:

```shell
npm run build
```

The built files will be in the `dist/` directory.

### Deploying / Publishing

The built project can be run using the start:prod command:

```shell
npm run start:prod
```

Alternatively, run the JavaScript file directly:

```shell
node dist/src/main
```

## Versioning

 This project is still in early beta and proper versioning has not yet been set up. However, we will likely be
implementing [SemVer](http://semver.org/) versioning at some point in the future.

## Configuration

Currently, all configuration for this project is controlled via `.env` files. You can use the `.env.sample` file as a
template, and then modify it to match your environment. `.env.docker` is used for Docker deployments, and should be
the same as your `.env` file, except any references to `localhost` need to be replaced with their corresponding Docker
service names.

### Environment Variables

| Name                         | Default/Required                     | Description                                                                                                                                                                                                                                                                        |
|------------------------------|--------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `NODE_ENV`                   | `development`                        | The environment in which this application is running. May be: `production`, `development`, `staging`, `test`                                                                                                                                                                       |
| `PORT`                       | `4000`                               | The port to run the NestJS server on.                                                                                                                                                                                                                                              |
| `DATABASE_URL`               | **Required**                         | A PostgreSQL connection URI for your database.                                                                                                                                                                                                                                     |
| `REDIS_URL`                  | **Required**                         | A Redis connection URI for your Redis database.                                                                                                                                                                                                                                    |
| `RABBITMQ_URL`               | **Required**                         | A RabbitMQ connection URI for your RabbitMQ server.                                                                                                                                                                                                                                |
| `SESSION_SECRET`             | **Required**                         | A random string used to hash session IDs. Must be at least 64 characters long. [Read more](https://security.stackexchange.com/questions/92122/why-is-it-insecure-to-store-the-session-id-in-a-cookie-directly#answer-93448)                                                        |
| `SESSION_NAME`               | `glimpse.sid`                        | The name to use within session cookies and in the Redis session store.                                                                                                                                                                                                             |
| `LOGIN_REDIRECT_COOKIE_NAME` | `glimpse.redirect`                   | The name of the cookie to store the login redirect URL in. This cookie is ephemeral, with a max life of 10 minutes.                                                                                                                                                                |
| `OAUTH_SUCCESS_REDIRECT`     | `/`                                  | The relative URI to redirect users to after a successful OAuth login. Should not include query parameters.                                                                                                                                                                         |
| `OAUTH_FAIL_REDIRECT`        | `/login`                             | The relative URI to redirect users to after a failed OAuth login. Should not include query parameters.                                                                                                                                                                             |
| `LOGIN_REDIRECT_HOSTS`       | _Optional_                           | A comma-separated list of hostnames that should be trusted in post-login user-provided redirects. Default is empty, which only allows relative redirects. E.g. `rpi.tv,rpitv.org`                                                                                                  |
| `DISCORD_CLIENT_ID`          | **Required**                         | The client ID for your Discord application, allowing for OAuth sign-in. Currently required.                                                                                                                                                                                        |
| `DISCORD_CLIENT_SECRET`      | **Required**                         | The secret corresponding to the above Discord client ID.                                                                                                                                                                                                                           |
| `DISCORD_CALLBACK_URL`       | **Required**                         | The URL which users should be redirected to by Discord after they've approved the OAuth authentication request. Must be an absolute URL. Should be the `/auth/discord` endpoint, but through a reverse proxy.                                                                      |
| `TRUST_PROXY`                | **Required**                         | Option defining when to trust proxied requests. This application is designed to run behind a reverse proxy, but this can be set to `false` to disable trusting proxies completely. Set as restrictive as possible. [Read more](https://expressjs.com/en/guide/behind-proxies.html) |
| `HTTPS`                      | `true` in `production` and `staging` | True/false value for whether the reverse proxy this application is running behind is HTTPS-only. This is used to mark cookies as [Secure-only](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies). You probably want this set to true.          |
| `LOG_LEVELS`                 | `log,warn,error` in production       | A comma-separated list of NestJS log levels that should be enabled. Valid values are: `verbose`, `debug`, `log`, `warn`, `error`.                                                                                                                                                  |


## Tests

The test suite is currently incomplete. You can run the tests using the test command:

```shell
npm run test
```

## Style guide

This project generally follows the guidelines found here: https://github.com/elsewhencode/project-guidelines

Code style is enforced using ESLint and Prettier. When you set up your development environment, as long as you follow
the provided instructions, a Git hook will be installed which will automatically format your code pre-commit. If you'd
like to do this manually, you can pass the `--ignore-scripts` flag to `npm i` to skip the Git hook installation and
run `npm run format` before committing your code.

An `.editorconfig` file is provided to help your editor automatically format your code to match the project's style.

## API Reference

### GraphQL

The API is primarily controlled via GraphQL, which has built-in documentation. Please 
[introspect](https://graphql.org/learn/introspection/) the API to view available documentation.

### HTTP

#### GET `/auth/discord`

##### Query Parameters

All query parameters are optional.

- `redirect` - The URL to redirect to after authentication. Can be relative or absolute.
- `code` - The Discord OAuth2 code. This is automatically provided by Discord after a successful authentication.
- `state` - The state parameter for the OAuth2 request. This is automatically provided by Discord after a successful 
  authentication.
- `error` - The error parameter for the OAuth2 request. This is automatically provided by Discord after a failed 
  authentication.
- `error_description` - The error description parameter for the OAuth2 request. This is automatically provided by 
  Discord after a failed authentication.

##### Response

The response will vary depending on whether the `code` or `error` query parameters are present.

- If neither `code` nor `error` are present, the user will be redirected to Discord to authenticate. If the `redirect` 
  query parameter is present, it will be saved for when the user returns from Discord. None of the other query
  parameters have any effect in this state.
- If either `code` or `error` are present, there are three possible error states:
  - `invalid_code` - The `code` parameter was present, but Discord did not return a valid access token (e.g. the code
    was invalid or expired).
  - `server_error` - The `error` parameter was present, indicating that Discord encountered an error while attempting
    to authenticate the user.
  - `no_user` - The `code` parameter was present, but Discord returned a valid access token for an account that does not
    correspond to a user within the database.
- If any of the three above errors occur, the user will be redirected to `<fail_redirect>?error=<error>`. If the 
  `redirect` query parameter was present when `state` was generated, the user will be redirected to 
  `<fail_redirect>?error=<error>&redirect=<redirect>`.
- If none of the errors occurred, the user will be redirected to `<success_redirect>`, unless the `redirect` query
  parameter was present when the state was generated, in which case the user will be redirected to the URL that was
  specified. A new sessioncookie will also be provided in the response.

Note that this API is intended to be proxied in production, e.g. to `/api`. The URLs that the user can be redirected to
should be implemented elsewhere (e.g. [rpitv/glimpse-ui](https://github.com/rpitv/glimpse-ui)), and will return a 404 if
the API is not being accessed through a proxy.

## Database

This project uses PostgreSQL v14 within it's default Docker containers. If you wish to run your database outside of
Docker, no other version has been tested.

Redis v7 is also used for state and session management.

## Licensing

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
