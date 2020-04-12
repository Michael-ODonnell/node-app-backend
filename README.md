# About
Creates a local environment backend infrasctructure with Postgres(https://www.prostresql.org), Redis(https://redis.io/) and a simple Node(https://nodejs.org/en/) based API based on expressJs(https://expressjs.com/)

## Requirements
- [Docker](https://docs.docker.com/install/)

## Usage

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

## Notes
* Scripts in postgres/init.d get executed upon volume creation in alphabetical order
* PGAdmin(https://www.pgadmin.org/) is a cross platform Web based UI for postgres
* RedisInsight(https://redislabs.com/redisinsight/) is similar for Redis
