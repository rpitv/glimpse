#Glimpse API
<img src="https://imgur.com/dmZSyhe.png" width="200px" alt="RPI TV Glimpse Logo" />
<br>
<br>

This is the backend API for Glimpse, the RPI TV website.
## Getting Started

### Method 1: Vagrant (Designed for Debian)
Vagrant is the recommended way of getting started, as it means no complex database setup
is necessary to get started developing. The Vagrantfile is pre-configured to install
Node.js and PostgreSQL on up.

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
   DATABASE name;`. Tables/schemas will be created for you automatically. Just make sure
   the user you create has permission to create new tables! If deploying to production,
   you may wish to remove this, and definitely remove the ability to drop (sensitive) tables.

### Method 2: Manual Setup
This method may be optimal for some use-cases where you can't or don't want to use Vagrant 
(e.g. deploying to production, developing locally, etc). There is not a step-by-step guide
for this method, however the project has the following dependencies:

* PostgreSQL (Tested on 11.6)
    * Credentials should be configured in the `.env` file per 
    [pg documentation](https://node-postgres.com/).
* Node.js (Tested on 12.15.0)

The project was developed with a Debian architecture in mind, however it will probably
work on most operating systems/architectures.
