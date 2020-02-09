#!/usr/bin/env bash

sudo apt-get install curl -y;
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -;
sudo apt-get update;
sudo apt-get install nodejs -y;

echo "deb http://apt.postgresql.org/pub/repos/apt/ jessie-pgdg main" > /etc/apt/sources.list.d/pgdg.list;
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -;
sudo apt-get update;
sudo apt-get install postgresql-11 -y;
sudo pg_ctlcluster 11 main start;
