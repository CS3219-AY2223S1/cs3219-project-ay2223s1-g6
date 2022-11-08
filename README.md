# Running this app locally

1. Make a copy of the `env.sample` file in the root directory of the project and name it `.env`

2. Fill up the `.env` file

   > Fields in the `.env` file that you might want to change or fill up:
   >
   > - `USER_SERVICE_MONGO_ENV`: By default this should be `PROD`, which will allow the user service database to use `USER_SERVICE_MONGO_URI_CLOUD` as the cloud URI. You can change it to `DEV` and run a local MongoDB, then putting the URI in the `USER_SERVICE_MONGO_URI_LOCAL` field.
   > - `USER_SERVICE_JWT_SECRET_KEY`: You can put your generated secret key here. Or you can use an example secret key: `b00f21108ef28c3984ca9dea05e8bf297a11688779376356e34406543991c0fc36b0ee5a6cf9a30b79e835746088e11932a637553beb82d0f8bc736584697a03` 
   > - `MATCHING_SERVICE_POSTGRES_PASSWORD`: You can put your password here.

3. Run `./startup.sh` and you should see the `.env` file being copied to all backend service folders.

4. Run `docker-compose --env-file ./.env up --build`

5. Wait until all containers are compiled and running, visit `localhost:3000` . (The frontend usually take the longest to compile, so you can wait for )
