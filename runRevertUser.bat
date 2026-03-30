@echo off
setlocal

set "USER_SERVICE_CONTAINER=user_service"
set "MIGRATION_REVERT_TARGET="

if not "%~1"=="" (
  set "MIGRATION_REVERT_TARGET=%~1"
)

echo ================================================
echo Running user-service reverts
echo ================================================

if defined MIGRATION_REVERT_TARGET (
  echo Target: %MIGRATION_REVERT_TARGET%
) else (
  echo Target: latest migration
)

echo.
if defined MIGRATION_REVERT_TARGET (
  docker exec -e MIGRATION_REVERT_TARGET=%MIGRATION_REVERT_TARGET% %USER_SERVICE_CONTAINER% npm run migrate:revert
) else (
  docker exec %USER_SERVICE_CONTAINER% npm run migrate:revert
)

if errorlevel 1 (
  echo [ERROR] User service reverts failed.
  exit /b 1
)

echo.
echo [OK] User service reverts completed successfully.
exit /b 0
