# Team Simulation - Server

## Setting up

### Pre-requisite

[Follow this guide to create your databases](./DB_SETUP.md)

Once you have complete the above guide, continue to the steps below.

1. Copy `.env.example` and name it `.env` (NOTE: Make sure to copy the file, don't remove the original)
2. Copy the URL of your **PRIMARY** database instance (see image below on how to get this) and place it into the `.env` file's `DATABASE_URL` variable, keeping `?schema=prisma` on the end. E.g. `DATABASE_URL="postgres://uy:ay@ka.db.elephantsql.com/ufy?schema=prisma"`
   ![](./assets/db-setup/4.PNG)
3. Do the same thing for your **SHADOW** database, placing its URL into the `SHADOW_DATABASE_URL` variable, keeping `?schema=shadow` on the end. E.g. `SHADOW_DATABASE_URL="postgres://jk:la@ka.db.elephantsql.com/irk?schema=shadow"`
4. `npm ci` to install dependencies
5. Run `npx prisma migrate reset` to build the database tables and insert some seed data (as defined in [./prisma/seed.js](./prisma/seed.js))
6. `npm run dev` to run the app

## API Spec

[todo]: <Deploy and update the link below>

[Deployed API Spec](https://UPDATEME)

The API Spec is hosted by the server itself (i.e. this project), and the view/page is generated automatically by the SwaggerUI libraryi.

To view it locally, you can just go to: [http://localhost:4000/api-docs](http://localhost:4000/api-docs).

Whenever you make any change to the API (e.g. adding a new route, changing the payload for an existing route, adding a new error), you must update the API Spec accordingly. To do this, you just need to update the `openapi.yaml` file -- guidance on the basic structure of the `openapi.yaml` file can be found [here](https://swagger.io/docs/specification/about/).

- **You should always verify these changes locally before committing your work.**
- If your server is already running when you changed the `openapi.yaml` file, you will need to stop and restart your server.
- Once verified, stage and commit the changes on the same branch where you changed the behaviour of the API.

## Seeded Data

Please review the [./prisma/seed.js](./prisma/seed.js) file to see the data that is seeded into the database when you run `npx prisma migrate reset`.

The users that are seeded can be used to test the API endpoints and to log into the client app.

## DATABASE ERD

[todo]: <Update this with your ERD>

TODO
