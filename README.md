# node-api-petshop-mysql

## Description:

This project is the final project of the course of the [NodeJS: Crie uma API REST padronizada e escalável](https://cursos.alura.com.br/course/nodejs-api-rest-padronizada-escalavel).

It is an API of pet shop to manager products and providers using mysql with ORM Sequelize and control of version.

Used Nodejs, mysql database, Sequelize.

----

## Install:

Before of run the project you have that install Mysql in your machine.

Create a new file *default.json* inside folder **config** in the root of the project and create this structure, remember use config of your mysql:

```json
{
  "mysql": {
    "database": "apipetshop",
    "user": "root",
    "password": "root",
    "host": "127.0.0.1"
  },
  "api": {
    "port": 3000
  }
}

```

To run the project use the steps below:

```sh
## install dependences
$ npm i

## run in development
$ npm run dev

```
This application run in port 3000.

----

Made by Janapc 🤘 Get in touch!
