@echo off
docker network create --driver bridge my-network

echo Launching user service
cd user-service
docker-compose up -d
cd ..

echo Launching team service
cd team-service
docker-compose up -d
cd ..

echo Launching pokeapi service
cd pokeapi-service
docker-compose up -d
cd ..

echo Launching API Gateway
cd api-gateway
docker-compose up -d
cd ..

echo That's finish !
pause
