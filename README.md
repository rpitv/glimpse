# Glimpse API

<img src="https://imgur.com/dmZSyhe.png" width="200px" alt="RPI TV Glimpse Logo" />
<br>
<br>

This is the backend API for Glimpse, the RPI TV website.
## Getting Started

### Method 1: Docker (Recommended)
Using Docker and Docker Compose is the recommended method for both local development and deploying to production. Using
Docker Compose, no database setup is necessary.

#### Prerequisites
1. Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).

#### Starting a Docker Container
1. Download the `docker` directory and the `.sample.env` file to where you'd like to run the website.
2. The `.sample.env` files located at `/.sample.env` and `/docker/db/.sample.env` contain all the
necessary environment variables already. Rename the files to `.env`, and update the variables to the correct
values for your use case (Note: `PGHOST=db` should not change).
3. Run: 
```shell script
$ cd docker
$ docker-compose up -d
```
to start your Docker Compose instance. To start in development mode, instead run: 
```shell script
$ cd docker
$ docker-compose -f ./docker-compose-dev.yml -d
```
This will automatically start both the API and DB containers. In development mode, files in the project directory will
automatically be copied to the Docker working directory (except `node_modules`). The server will also restart when
changes are detected. Changes will not affect the image, so you will still have to build before pushing to Docker Hub.

4. If something goes wrong with the database, make sure Docker is able to write to the directory `/db/postgres-data`.
5. Execute `docker-compose down` to bring down the Docker container.

#### Building and pushing an update
To update the API image and push it to Docker Hub:
```shell script
$ docker build -t rpitv/glimpse-api -f docker/api/Dockerfile .
$ docker push rpitv/glimpse-api
```

### Method 2: Vagrant (Development only)
Vagrant is no longer the recommended way of running a local development server, but it is still available.

1. [Install Vagrant and VirtualBox](https://www.vagrantup.com/intro/getting-started/install.html).
2. Start up your Vagrant box with `vagrant up` in this directory.
3. Load in/create your `.env` file. The `.env` file will contain your database credentials.
4. SSH into your Vagrant box with `vagrant ssh` and run `cd /vagrant` to get to the project 
directory.
5. Install project dependencies with `npm i`. We do this inside Vagrant to make sure any
   OS-dependent dependencies are correct.
6. You will likely need to configure your PostgreSQL server by adding a new user/database
   in accordance with your `.env` file. In Vagrant, run `psql` to enter the PostgreSQL 
   terminal. You can create users by running the command `CREATE USER name WITH 
   PASSWORD 'password';`. You can create new databases with the command `CREATE 
   DATABASE name;`. Tables/schemas will be created for you automatically.
### Method 3: Manual Setup
This method may be optimal for some use-cases where you can't or don't want to use Vagrant or Docker.
There is not a step-by-step guide for this method, however the project has the following dependencies:

* PostgreSQL (Tested on 12.3)
    * Credentials should be configured in the `.env` file per 
    [pg documentation](https://node-postgres.com/).
* Node.js (Tested on ^14.3.0)
