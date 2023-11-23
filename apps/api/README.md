## API

The Alcoves API.

The API starts with creating an asset. An asset

### Development

#### Database

These commands assume Docker Compose is running
https://www.prisma.io/docs/reference/api-reference/command-reference

```bash

# Create migrations from your Prisma schema, apply them to the database, generate artifacts (e.g. Prisma Client)
docker exec -it alcoves bash
cd apps/api && yarn prisma migrate dev

# Pull the schema from an existing database, updating the Prisma schema
docker exec alcoves cd apps/api && yarn prisma db pull

# Push the Prisma schema state to the database
docker exec alcoves cd apps/api && yarn prisma db pull
```
