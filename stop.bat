@echo off
echo Stopping API Gateway
cd api-gateway
docker-compose down
docker rmi api-gateway-api_gateway
cd ..

echo Stopping team service
cd team-service
docker-compose down
docker rmi team-service-team-app
cd ..

echo Stopping user service
cd user-service
docker-compose down
docker rmi user-service-user-app
cd ..

echo All services stopped !
pause
