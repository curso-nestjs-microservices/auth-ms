# Auth Microservice

## Dev

1. Clonar el repositorio
2. Instalar dependencias `npm i`
3. Crear un archivo `.env` basado en el `env.template`
4. Ejecutar migración de prisma `npx prisma generate`
5. Levantar el servidor de NATS
```
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats:2.10-alpine3.20
```
6. Ejecutar `npm run start:dev`

## Generar imagen de Docker productiva
```
docker build -f dockerfile.prod -t auth-ms .
```