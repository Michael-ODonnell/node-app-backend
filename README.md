# About
Creates a local environment backend infrasctructure with [Postgres](https://www.prostresql.org), [Redis](https://redis.io/) and a simple [Node](https://nodejs.org/en/) based API based on [expressJs](https://expressjs.com/)

## Requirements
- [Docker](https://docs.docker.com/install/)

## Usage
### Example curl requests to the API

Create a user
```
curl -H "Content-Type: application/json" --request POST -d '{"username":"boo"}' http://localhost:3000/users/create
```

Get a username from a GUID
```
curl http://localhost:3000/users/*GUID*
```

Publish a message
```
curl -H "Content-Type: application/json"   --request POST   -d '{"message":"Hi everybody"}'   http://localhost:3000/messages/publish
```

Run database migrations
```
docker exec postgres bash //docker-entrypoint-initdb.d/run_migrations.sh -u postgres -d postgres
```
Existing migrations are applied automatically when the container is created, but you'll need to run this to apply new migrations.

## Commands

### Launching the backend
Launch
`docker compose up -d`

View logs 
`docker compose logs -f`

### Database volume management
List all volumes  
`docker volume ls`  
  
Delete the data volumes. This erases all stored data and will recreate the db on next launch  
`docker volume rm *PARENT_FOLDER*_postgres *PARENT_FOLDER*_redis`  
  
### Access container  
`docker exec -it web bash`  
`docker exec -it redis bash`  
`docker exec -it postgres bash` 

## To Do
- Authenticated requests. Create a logged in endpoint that can only be accessed by authenticating the user.
- Session persistence using Redis and JWT.
- Terraform setup.

## Notes
* Scripts in postgres/init.d get executed upon volume creation in alphabetical order
* [PGAdmin](https://www.pgadmin.org/) is a cross platform Web based UI for postgres
* [RedisInsight](https://redislabs.com/redisinsight/) is similar for Redis
