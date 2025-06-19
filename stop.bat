@echo off
echo Stopping API Gateway
cd api-gateway
docker-compose down
cd ..

echo Stopping team service
cd team-service
docker-compose down
cd ..

echo Stopping user service
cd user-service
docker-compose down
cd ..

echo All services stopped !
pause
