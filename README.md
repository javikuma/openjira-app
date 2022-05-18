# Next.js OpenJira App

Execute Data base

```
docker-compose up -d
```

-  flag -d = __detached__



## Configure enviroment variables
Rename file __.env.template__ to __.env__

* MongoDB URL local

```
mongodb://localhost:27017/entriesdb
```

* Install node_modules
```
yarn install
```

* Execute for development mode
```
yarn dev
```

## Mock DB

* Endpoint:
```
http://localhost:3000/api/seed
```