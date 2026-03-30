@echo off
setlocal

set "USER_SERVICE_CONTAINER=user_service"
set "ROOT_DIR=%~dp0"
set "MIGRATION_TARGET="

if not "%~1"=="" (
  set "MIGRATION_TARGET=%~1"
)

echo ================================================
echo Running user-service migrations
echo ================================================

if defined MIGRATION_TARGET (
  echo Target: %MIGRATION_TARGET%
) else (
  echo Target: latest pending migration
)

echo.
docker cp "%ROOT_DIR%user-service\migrations\." %USER_SERVICE_CONTAINER%:/migrations
if errorlevel 1 (
  echo [ERROR] Failed to sync user migrations into container.
  exit /b 1
)

docker cp "%ROOT_DIR%user-service\src\init\runMigrations.ts" %USER_SERVICE_CONTAINER%:/src/init/runMigrations.ts
if errorlevel 1 (
  echo [ERROR] Failed to sync user migration runner into container.
  exit /b 1
)

docker exec %USER_SERVICE_CONTAINER% npm run build
if errorlevel 1 (
  echo [ERROR] User service build failed.
  exit /b 1
)

if defined MIGRATION_TARGET (
  docker exec -e MIGRATION_TARGET=%MIGRATION_TARGET% %USER_SERVICE_CONTAINER% node -e "require('./dist/init/runMigrations.js').runMigrations().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); })"
) else (
  docker exec %USER_SERVICE_CONTAINER% node -e "require('./dist/init/runMigrations.js').runMigrations().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); })"
)

if errorlevel 1 (
  echo [ERROR] User service migrations failed.
  exit /b 1
)

echo.
echo [OK] User service migrations completed successfully.
exit /b 0
