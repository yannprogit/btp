@echo off
setlocal

for /f %%P in ('powershell -NoProfile -Command "Get-CimInstance Win32_Process ^| Where-Object { $_.CommandLine -like ''*api-gateway*src/server.ts*'' } ^| Select-Object -ExpandProperty ProcessId"') do (
	echo Stopping stale api-gateway process %%P
	taskkill /F /PID %%P >nul 2>&1
)

for /f "usebackq tokens=1* delims==" %%A in (".env") do set "%%A=%%B"

docker network create --driver bridge btp-network

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

echo Launching Frontend
cd frontend
docker-compose up -d
cd ..

echo That's finish !
pause
