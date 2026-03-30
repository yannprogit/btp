@echo off
setlocal

set "TEAM_SERVICE_CONTAINER=team_service"
set "ROOT_DIR=%~dp0"
set "MIGRATION_TARGET="

if not "%~1"=="" (
  set "MIGRATION_TARGET=%~1"
)

echo ================================================
echo Running team-service migrations
echo ================================================

if defined MIGRATION_TARGET (
  echo Target: %MIGRATION_TARGET%
) else (
  echo Target: latest pending migration
)

echo.
docker cp "%ROOT_DIR%team-service\migrations\." %TEAM_SERVICE_CONTAINER%:/migrations
if errorlevel 1 (
  echo [ERROR] Failed to sync team migrations into container.
  exit /b 1
)

docker cp "%ROOT_DIR%team-service\src\init\runMigrations.ts" %TEAM_SERVICE_CONTAINER%:/src/init/runMigrations.ts
if errorlevel 1 (
  echo [ERROR] Failed to sync team migration runner into container.
  exit /b 1
)

docker exec %TEAM_SERVICE_CONTAINER% npm run build
if errorlevel 1 (
  echo [ERROR] Team service build failed.
  exit /b 1
)

if defined MIGRATION_TARGET (
  docker exec -e MIGRATION_TARGET=%MIGRATION_TARGET% %TEAM_SERVICE_CONTAINER% node -e "require('./dist/init/runMigrations.js').runMigrations().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); })"
) else (
  docker exec %TEAM_SERVICE_CONTAINER% node -e "require('./dist/init/runMigrations.js').runMigrations().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); })"
)

if errorlevel 1 (
  echo [ERROR] Team service migrations failed.
  exit /b 1
)

echo.
echo [OK] Team service migrations completed successfully.
exit /b 0
