<img src="rpitv_glimpse_logo.png" alt="RPI TV Glimpse logo" width="400">

# RPI TV Glimpse Video &middot; [![GitHub license](https://img.shields.io/github/license/rpitv/glimpse-video)](https://github.com/rpitv/glimpse-video/blob/dev/LICENSE)

> Ingestion and distribution servers for RPI TV livestreams

When RPI TV livestreams are broadcast, they are sent to a central server for distribution to the public. This repository contains the code for the ingestion and distribution servers.

## Installing / Getting started

This repository's content is distributed via two docker containers:

- [ghcr.io/rpitv/glimpse-video](https://github.com/rpitv/glimpse-video/pkgs/container/glimpse-video)
- [ghcr.io/rpitv/glimpse-video-control](https://github.com/rpitv/glimpse-video/pkgs/container/glimpse-video-control)

Install them locally via docker:

```shell
docker pull ghcr.io/rpitv/glimpse-video
docker pull ghcr.io/rpitv/glimpse-video-control
```

You may need to [sign in to the GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) to pull the images.

After that, you can start the video ingestion server via:
```shell
docker run -p 1935:1935 --network="glimpse_network" ghcr.io/rpitv/glimpse-video
```
and the video distribution server via:
```shell
docker run -p 8080:8080 --network="glimpse_network" ghcr.io/rpitv/glimpse-video-control
```

Alternatively, use a [Docker Compose file like the one included](./docker-compose.yml) to start both servers at once.

### Environment Variables
Currently only one environment variable is required:
- `RABBITMQ_URL` - The URL of the RabbitMQ server to connect to.

### Volumes
No volumes are currently used.

## Developing

### Built With

The ingestion server is built with Nginx with [nginx-rtmp-module](https://github.com/arut/nginx-rtmp-module), and the distribution server is built with TypeScript, and requires a RabbitMQ server to receive commands.

### Prerequisites

In production, both servers should be run in a Docker container, however containerized development environments currently aren't fully set up. You should have Node.js LTS installed, and a RabbitMQ server running.

### Setting up Dev

Run the following commands to set up your project.

```shell
git clone git@github.com:rpitv/glimpse-video.git
cd glimpse-video/control
npm install
npm run prepare
```

### Building

You can build the distribution server locally via:
```shell
npm run build
```

The ingestion server is nothing but an Nginx configuration file, so there's no need to build anything but the Nginx server + module, or just use a Docker container.

To build the Docker container images, run:
```shell
docker build -t ghcr.io/rpitv/glimpse-video .
cd control
docker build -t ghcr.io/rpitv/glimpse-video-control .
```

GitHub Actions will auto-build and deploy the Docker containers upon merge to the `release` branch.

Running the build command will compile the TypeScript into JavaScript located within the `/dist` directory.

## Versioning

This project uses [SemVer](http://semver.org/) for versioning. (FIXME)

## Tests

TODO

## Style guide

This project follows the guidelines found here: https://github.com/elsewhencode/project-guidelines

The main branch is the development branch. When it's time for a release, a release on GitHub is made and auto-published to GitHub Container Registry.

Code style is enforced in `/control` using ESLint. Continuous Integration runs the linter before tests, however you may also run the linter yourself using:

```shell
npm run lint
```

Automatically fix style issues with:

```shell
npm run fix
```

This command will automatically run in a pre-commit Git hook.

## API Reference

TODO

## Licensing

[This project is licensed under the MIT license.](./LICENSE)
