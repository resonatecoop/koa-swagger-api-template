# Koa swagger api template

## Stack

- Koa
- Koa grant
- Swagger ui
- Sequelize
- Redis (cache)

## Installation

```sh
npm install
```

## Build (babel)

```sh
npm run build
```

## Env

```
cp .env.example .env
```

## Development

```sh
npm run dev
```

## Testing

```sh
npm test
```

## Db connection

Multiple db connections (mysql, postgres) are supported with sequelize.
Config is at `src/config/databases.js`.

## Connect to OAuth2 server using koa grant

This API can connect to an OAuth2 server like `resonatecoop/id`.
Config is at `src/config/grant.js`.


## LICENSE

MIT
