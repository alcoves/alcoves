# Pier

### The official API of bken

### Prisma migrations

```
Setup a new Prisma project
npx prisma init

Generate artifacts (e.g. Prisma Client)
npx prisma generate

Browse your data
npx prisma studio

Create migrations from your Prisma schema, apply them to the database, generate artifacts (e.g. Prisma Client)
npx prisma migrate dev

Pull the schema from an existing database, updating the Prisma schema
npx prisma db pull

Push the Prisma schema state to the database
npx prisma db push
```

### Env

```
JWT_SECRET

DATABASE_URL
PGB_DATABASE_URL

SPACES_ENDPOINT
SPACES_ACCESS_KEY_ID
SPACES_SECRET_ACCESS_KEY
```

### Gateway Events

The websocket gateway handles updating clients with the freshest data possible. A number of events are used to make this possible

Typically, the flow goes like this.

- Connect to gateway
- Join rooms (harbor) using an accessToken
  - You are joined with all the harbors you have access to, plus a global event channel

Events

```
// Global

ping -> pong
status -> returns system status

```
