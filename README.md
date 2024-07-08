# Advanced Bookstore API

## Installation

- opern your terminal and follow this steps
- clone this repository

```bash
$ git clone https://github.com/t0nxx/advanced-bookstore-api.git
```

- navigate to the project directory

```bash
$ cd advanced-bookstore-api
```

- create a .env file copied from .env.example

```bash
$ cp .env.example .env
```

- change required credentials with your credentials in .env file

- install required dependencies

```bash
$ npm install
```

- migrate and clean db (after u set a valid database url in .env file)

```bash
$ npm run db:reset
```

- (optional) seed the database (prepared records)

```bash
$ npm run db:seed
```

- run tests

```bash
$ npm run test
```

## Running the app

```bash
# development
$ npm run start:dev
```

- visit swagger api doc in your browser 
http://127.0.0.1:3003/docs

- instructions video
https://youtu.be/lQAj-XSO49Q
